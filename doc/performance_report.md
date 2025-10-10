# Optimize app performance without modifications
_Exported on 10/10/2025 at 11:52:48 GMT+2 from Cursor (1.7.39)_

---

**User**

I feel like my app sometimes is slow. I would like you to check my code and identify things that I could optimize. For now, I don't want you to modify anything. I just want you to explain to me why I should change things, and how.

---

**Cursor**

I'll scan the codebase for common performance pitfalls in React Native apps (lists, re-renders, context usage, expensive computations in render). I'll start with broad semantic searches across components and utils to identify hotspots.

I scanned your UI, contexts, and hooks for common React Native performance pitfalls. I’ll point to the exact places and explain what to change and why, plus a short “how” for each.

### Lists and virtualization

- FlatList in deck view could render more efficiently
  - Why: Inline renderItem functions, no windowing tuning, and no stable item layout make React re-create closures and RN to measure items repeatedly, hurting scroll perf on large lists.
  - Where:
    ```117:128:components/display/Deck.tsx
        <FlatList
          data={filteredCards}
          renderItem={({ item }) => (
            <ListCard card={item} triggerReload={reload} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[GlobalStyles.container, styles.cardsDisplay]}
          showsVerticalScrollIndicator={false}
        />
    ```
  - How:
    - Extract `renderItem` with `useCallback`.
    - Memoize `ListCard` (React.memo).
    - Add `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`.
    - If item height is known/fixed, add `getItemLayout`.

- Library uses ScrollView instead of FlatList
  - Why: ScrollView renders all children; for many decks this causes heavy mounting and memory use.
  - Where:
    ```50:58:components/display/Library.tsx
      {decks.length > 0 ? (
        <ScrollView
          contentContainerStyle={[GlobalStyles.container, styles.decksDisplay]}
          showsVerticalScrollIndicator={false}
        >
          {decks.map((deck) => (
            <DeckCard deck={deck} openDeck={openDeck} key={deck.id} />
          ))}
        </ScrollView>
      ) : (
    ```
  - How:
    - Replace with `FlatList` using `data={decks}`, `renderItem`, `keyExtractor`.
    - Provide `getItemLayout` if `DeckCard` has stable size.

### Avoid unnecessary re-renders

- Memoize context provider values
  - Why: Passing a new object each render forces every consumer to re-render.
  - Where:
    ```60:66:context/SettingsContext.tsx
    return (
      <SettingsContext.Provider value={{
        ...settings,
        setLanguage,
      }}>
        {children}
      </SettingsContext.Provider>
    );
    ```
  - How:
    - Wrap the value in `useMemo(() => ({ ...settings, setLanguage }), [settings, setLanguage])`.
    - Also memoize `setLanguage` with `useCallback`.

- Memoize list item components and handlers
  - Why: `ListCard` will re-render when its parent re-renders if not memoized; inline handlers create new identities every time.
  - Where:
    ```22:105:components/card/ListCard.tsx
    export function ListCard({ card, triggerReload }: ListCardProps) {
      const [showConfirmDialog, setShowConfirmDialog] = useState(false);
      ...
      <TouchableRipple
        onPress={() =>
          router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
        }
        onLongPress={handleLongPress}
      >
    ```
  - How:
    - `export const ListCard = React.memo(function ListCard(props) { ... })`.
    - Lift navigation callbacks or wrap with `useCallback`.
    - Ensure parent passes stable callbacks (wrap `reload` in `useCallback` where it’s defined).

- Inline renderItem in FlatList
  - Why: New function each render prevents PureComponent optimizations.
  - Where: same Deck FlatList snippet above.
  - How: `const renderItem = useCallback(({item}) => <ListCard ... />, [reload])`.

### Derived state and filtering

- Derived state stored + recalculated via effects in deck filtering
  - Why: Keeping `filteredCards` as state plus multiple effects adds extra renders and work; better to compute from source with `useMemo`, debounce input, and pre-normalize strings.
  - Where:
    ```32:74:components/display/Deck.tsx
    const [searchText, setSearchText] = useState('');
    const [filteredCards, setFilteredCards] = useState<CardType[]>(cards);
    ...
    useEffect(() => { setFilteredCards(cards); }, [cards]);
    useEffect(() => {
      let filtered = cards;
      ...
      if (searchText.trim() !== '') {
        filtered = filtered.filter(card =>
          card.recto?.toLowerCase()?.includes(searchText.toLowerCase()) ||
          card.verso?.toLowerCase()?.includes(searchText.toLowerCase())
        );
      }
      setFilteredCards(filtered);
    }, [searchText, cards, filterCards]);
    ```
  - How:
    - Replace `filteredCards` state/effects with `const filteredCards = useMemo(..., [cards, filterCards, normalizedSearch])`.
    - Debounce `searchText` by 150–300ms.
    - Precompute `lowerSearch = searchText.trim().toLowerCase()` once per change.

### Images

- Network images in flash content may re-fetch and cause layout passes
  - Why: `Image` with `source={{ uri }}` lacks caching controls and often waits for layout. Large images can also jank the JS thread when toggling.
  - Where:
    ```20:24:components/card/FlashCardContent.tsx
        <Image
          style={styles.imageFull}
          resizeMode="contain"
          source={{ uri: image as string }}
        />
    ```
    ```33:37:components/card/FlashCardContent.tsx
            <Image
              style={styles.imagePartial}
              resizeMode="contain"
              source={{ uri: image as string }}
            />
    ```
  - How:
    - Prefer `expo-image`’s `Image` with `cachePolicy="memory-disk"` and `contentFit="contain"`.
    - Provide explicit width/height where possible to avoid extra layout passes.
    - If many images are shown in a list, consider `recycling` or `reusing` with `expo-image`.

- In `app/modalCard.tsx`, previews also use plain `Card.Cover` from URIs; same caching/size guidance applies.

### Tutorial carousel

- FlatList horizontal is good; minor improvements
  - Where:
    ```63:89:components/modal/TutorialModal.tsx
      <FlatList
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        ...
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View key={i} ... />
        ))}
      </View>
    ```
  - How:
    - Memoize `renderItem` and `keyExtractor`.
    - Memoize dot rendering (`useMemo`) if slides count is larger; otherwise it’s fine.

### Database and effects

- Batch async calls and avoid redundant state churn
  - Where:
    ```139:154:components/tab/Home.tsx
    useFocusEffect(
      useCallback(() => {
        loadState();
        getAllDecks(database).then(setDecks);
        getGeneralProgress(database).then(setGeneralProgress);
        return () => { saveState(latestStateRef.current); };
      }, []),
    );
    ```
  - How:
    - Run `Promise.all` for independent queries.
    - Wrap state setters when values didn’t change to avoid re-renders (compare previous length/ids if heavy).
    - Ensure any callbacks passed down to children are wrapped in `useCallback`.

- Daily flow shuffles and runs multiple queries
  - Where:
    ```62:76:components/tab/Daily.tsx
    useFocusEffect(
      useCallback(() => {
        setPreviousCard(undefined);
        getCardsToRevise(database).then((cardsResult) => {
          shuffle(cardsResult);
          updateCardsToRevise(cardsResult);
          setInSecondPhase(false);
          if (cardsResult.length === 0) {
            getNbCardsToReviseThisWeek(database).then(setNbCardsToReviseThisWeek);
          }
        });
      }, []),
    );
    ```
  - How:
    - Consider doing shuffle in a WebWorker-like offload (not trivial on RN) or at least ensure `shuffle` is O(n) and non-allocating.
    - Keep `updateCardsToRevise` purity high to avoid multiple state updates per tick—batch with a single `setState` where feasible.

### Theming and contexts

- NotificationContext is already optimized with `useMemo` and `useCallback` for value—good.
- SettingsContext: see memoization fix above.
- Hooks like `useSettings` expose arrays/booleans; if you pass these widely, it’s worth memoizing derived config objects before providing or passing as props.

### Navigation callbacks

- Inline `router.push` lambdas are fine but create new functions on every render inside list items
  - Where: `ListCard` and deck/list items.
  - How: memoize navigation handlers with `useCallback` or compute outside render and pass stable references.

### Profiling and quick wins checklist

- Add React Profiler (Flipper) to see component render counts; target those re-rendering on unrelated state changes.
- Turn on `why-did-you-render` in development to catch avoidable re-renders for `ListCard`, `DeckCard`, etc.
- Validate FlatList perf flags on large datasets:
  - `initialNumToRender`, `maxToRenderPerBatch`, `updateCellsBatchingPeriod`, `windowSize`, `removeClippedSubviews`, `getItemLayout`.
- Debounce search input and derive filtered arrays via `useMemo` instead of state.
- Memoize context values and callbacks.
- Replace ScrollView with FlatList where lists can grow.

If you’d like, I can implement these changes in small, reviewable edits starting with the highest impact: replacing the `Library` ScrollView, memoizing `SettingsContext` value, and optimizing the `Deck` FlatList.

- I identified the main hotspots in your lists, context values, image rendering, and derived state. Next, I can prioritize and implement the top 3 changes unless you prefer a different order.

```typescriptreact
        <FlatList
          data={filteredCards}
          renderItem={({ item }) => (
            <ListCard card={item} triggerReload={reload} />
          )}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={[GlobalStyles.container, styles.cardsDisplay]}
          showsVerticalScrollIndicator={false}
        />
    ```
  - How:
    - Extract `renderItem` with `useCallback`.
    - Memoize `ListCard` (React.memo).
    - Add `initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `removeClippedSubviews`.
    - If item height is known/fixed, add `getItemLayout`.

- Library uses ScrollView instead of FlatList
  - Why: ScrollView renders all children; for many decks this causes heavy mounting and memory use.
  - Where:
    ```50:58:components/display/Library.tsx
      {decks.length > 0 ? (
        <ScrollView
          contentContainerStyle={[GlobalStyles.container, styles.decksDisplay]}
          showsVerticalScrollIndicator={false}
        >
          {decks.map((deck) => (
            <DeckCard deck={deck} openDeck={openDeck} key={deck.id} />
          ))}
        </ScrollView>
      ) : (
    ```
  - How:
    - Replace with `FlatList` using `data={decks}`, `renderItem`, `keyExtractor`.
    - Provide `getItemLayout` if `DeckCard` has stable size.

### Avoid unnecessary re-renders

- Memoize context provider values
  - Why: Passing a new object each render forces every consumer to re-render.
  - Where:
    ```60:66:context/SettingsContext.tsx
    return (
      <SettingsContext.Provider value={{
        ...settings,
        setLanguage,
      }}>
        {children}
      </SettingsContext.Provider>
    );
    ```
  - How:
    - Wrap the value in `useMemo(() => ({ ...settings, setLanguage }), [settings, setLanguage])`.
    - Also memoize `setLanguage` with `useCallback`.

- Memoize list item components and handlers
  - Why: `ListCard` will re-render when its parent re-renders if not memoized; inline handlers create new identities every time.
  - Where:
    ```22:105:components/card/ListCard.tsx
    export function ListCard({ card, triggerReload }: ListCardProps) {
      const [showConfirmDialog, setShowConfirmDialog] = useState(false);
      ...
      <TouchableRipple
        onPress={() =>
          router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
        }
        onLongPress={handleLongPress}
      >
    ```
  - How:
    - `export const ListCard = React.memo(function ListCard(props) { ... })`.
    - Lift navigation callbacks or wrap with `useCallback`.
    - Ensure parent passes stable callbacks (wrap `reload` in `useCallback` where it’s defined).

- Inline renderItem in FlatList
  - Why: New function each render prevents PureComponent optimizations.
  - Where: same Deck FlatList snippet above.
  - How: `const renderItem = useCallback(({item}) => <ListCard ... />, [reload])`.

### Derived state and filtering

- Derived state stored + recalculated via effects in deck filtering
  - Why: Keeping `filteredCards` as state plus multiple effects adds extra renders and work; better to compute from source with `useMemo`, debounce input, and pre-normalize strings.
  - Where:
    ```32:74:components/display/Deck.tsx
    const [searchText, setSearchText] = useState('');
    const [filteredCards, setFilteredCards] = useState<CardType[]>(cards);
    ...
    useEffect(() => { setFilteredCards(cards); }, [cards]);
    useEffect(() => {
      let filtered = cards;
      ...
      if (searchText.trim() !== '') {
        filtered = filtered.filter(card =>
          card.recto?.toLowerCase()?.includes(searchText.toLowerCase()) ||
          card.verso?.toLowerCase()?.includes(searchText.toLowerCase())
        );
      }
      setFilteredCards(filtered);
    }, [searchText, cards, filterCards]);
    ```
  - How:
    - Replace `filteredCards` state/effects with `const filteredCards = useMemo(..., [cards, filterCards, normalizedSearch])`.
    - Debounce `searchText` by 150–300ms.
    - Precompute `lowerSearch = searchText.trim().toLowerCase()` once per change.

### Images

- Network images in flash content may re-fetch and cause layout passes
  - Why: `Image` with `source={{ uri }}` lacks caching controls and often waits for layout. Large images can also jank the JS thread when toggling.
  - Where:
    ```20:24:components/card/FlashCardContent.tsx
        <Image
          style={styles.imageFull}
          resizeMode="contain"
          source={{ uri: image as string }}
        />
    ```
    ```33:37:components/card/FlashCardContent.tsx
            <Image
              style={styles.imagePartial}
              resizeMode="contain"
              source={{ uri: image as string }}
            />
    ```
  - How:
    - Prefer `expo-image`’s `Image` with `cachePolicy="memory-disk"` and `contentFit="contain"`.
    - Provide explicit width/height where possible to avoid extra layout passes.
    - If many images are shown in a list, consider `recycling` or `reusing` with `expo-image`.

- In `app/modalCard.tsx`, previews also use plain `Card.Cover` from URIs; same caching/size guidance applies.

### Tutorial carousel

- FlatList horizontal is good; minor improvements
  - Where:
    ```63:89:components/modal/TutorialModal.tsx
      <FlatList
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        ...
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View key={i} ... />
        ))}
      </View>
    ```
  - How:
    - Memoize `renderItem` and `keyExtractor`.
    - Memoize dot rendering (`useMemo`) if slides count is larger; otherwise it’s fine.

### Database and effects

- Batch async calls and avoid redundant state churn
  - Where:
    ```139:154:components/tab/Home.tsx
    useFocusEffect(
      useCallback(() => {
        loadState();
        getAllDecks(database).then(setDecks);
        getGeneralProgress(database).then(setGeneralProgress);
        return () => { saveState(latestStateRef.current); };
      }, []),
    );
    ```
  - How:
    - Run `Promise.all` for independent queries.
    - Wrap state setters when values didn’t change to avoid re-renders (compare previous length/ids if heavy).
    - Ensure any callbacks passed down to children are wrapped in `useCallback`.

- Daily flow shuffles and runs multiple queries
  - Where:
    ```62:76:components/tab/Daily.tsx
    useFocusEffect(
      useCallback(() => {
        setPreviousCard(undefined);
        getCardsToRevise(database).then((cardsResult) => {
          shuffle(cardsResult);
          updateCardsToRevise(cardsResult);
          setInSecondPhase(false);
          if (cardsResult.length === 0) {
            getNbCardsToReviseThisWeek(database).then(setNbCardsToReviseThisWeek);
          }
        });
      }, []),
    );
    ```
  - How:
    - Consider doing shuffle in a WebWorker-like offload (not trivial on RN) or at least ensure `shuffle` is O(n) and non-allocating.
    - Keep `updateCardsToRevise` purity high to avoid multiple state updates per tick—batch with a single `setState` where feasible.

### Theming and contexts

- NotificationContext is already optimized with `useMemo` and `useCallback` for value—good.
- SettingsContext: see memoization fix above.
- Hooks like `useSettings` expose arrays/booleans; if you pass these widely, it’s worth memoizing derived config objects before providing or passing as props.

### Navigation callbacks

- Inline `router.push` lambdas are fine but create new functions on every render inside list items
  - Where: `ListCard` and deck/list items.
  - How: memoize navigation handlers with `useCallback` or compute outside render and pass stable references.

### Profiling and quick wins checklist

- Add React Profiler (Flipper) to see component render counts; target those re-rendering on unrelated state changes.
- Turn on `why-did-you-render` in development to catch avoidable re-renders for `ListCard`, `DeckCard`, etc.
- Validate FlatList perf flags on large datasets:
  - `initialNumToRender`, `maxToRenderPerBatch`, `updateCellsBatchingPeriod`, `windowSize`, `removeClippedSubviews`, `getItemLayout`.
- Debounce search input and derive filtered arrays via `useMemo` instead of state.
- Memoize context values and callbacks.
- Replace ScrollView with FlatList where lists can grow.

If you’d like, I can implement these changes in small, reviewable edits starting with the highest impact: replacing the `Library` ScrollView, memoizing `SettingsContext` value, and optimizing the `Deck` FlatList.

- I identified the main hotspots in your lists, context values, image rendering, and derived state. Next, I can prioritize and implement the top 3 changes unless you prefer a different order.
```

```typescriptreact
      {decks.length > 0 ? (
        <ScrollView
          contentContainerStyle={[GlobalStyles.container, styles.decksDisplay]}
          showsVerticalScrollIndicator={false}
        >
          {decks.map((deck) => (
            <DeckCard deck={deck} openDeck={openDeck} key={deck.id} />
          ))}
        </ScrollView>
      ) : (
```

```typescriptreact
    return (
      <SettingsContext.Provider value={{
        ...settings,
        setLanguage,
      }}>
        {children}
      </SettingsContext.Provider>
    );
```

```typescriptreact
    export function ListCard({ card, triggerReload }: ListCardProps) {
      const [showConfirmDialog, setShowConfirmDialog] = useState(false);
      ...
      <TouchableRipple
        onPress={() =>
          router.push(`/modalCard?idDeck=${card.deck}&idCard=${card.id}`)
        }
        onLongPress={handleLongPress}
      >
```

```typescriptreact
    const [searchText, setSearchText] = useState('');
    const [filteredCards, setFilteredCards] = useState<CardType[]>(cards);
    ...
    useEffect(() => { setFilteredCards(cards); }, [cards]);
    useEffect(() => {
      let filtered = cards;
      ...
      if (searchText.trim() !== '') {
        filtered = filtered.filter(card =>
          card.recto?.toLowerCase()?.includes(searchText.toLowerCase()) ||
          card.verso?.toLowerCase()?.includes(searchText.toLowerCase())
        );
      }
      setFilteredCards(filtered);
    }, [searchText, cards, filterCards]);
```

```typescriptreact
        <Image
          style={styles.imageFull}
          resizeMode="contain"
          source={{ uri: image as string }}
        />
```

```typescriptreact
            <Image
              style={styles.imagePartial}
              resizeMode="contain"
              source={{ uri: image as string }}
            />
```

```typescriptreact
      <FlatList
        horizontal
        pagingEnabled
        scrollEventThrottle={16}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        ...
      />
      <View style={styles.dotsContainer}>
        {slides.map((_, i) => (
          <View key={i} ... />
        ))}
      </View>
```

```typescriptreact
    useFocusEffect(
      useCallback(() => {
        loadState();
        getAllDecks(database).then(setDecks);
        getGeneralProgress(database).then(setGeneralProgress);
        return () => { saveState(latestStateRef.current); };
      }, []),
    );
```

```typescriptreact
    useFocusEffect(
      useCallback(() => {
        setPreviousCard(undefined);
        getCardsToRevise(database).then((cardsResult) => {
          shuffle(cardsResult);
          updateCardsToRevise(cardsResult);
          setInSecondPhase(false);
          if (cardsResult.length === 0) {
            getNbCardsToReviseThisWeek(database).then(setNbCardsToReviseThisWeek);
          }
        });
      }, []),
    );
```

