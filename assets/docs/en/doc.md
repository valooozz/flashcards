# Documentation

## Library
The left tab is the **Library**. This is where you can create decks that contain cards.

### Creating a Deck
To add a deck, click the **+** button. To create a new empty deck, enter its name and click *Add*.
You can also import an existing deck. Two import formats are available:
- **JSON format** follows the same structure as the app’s export feature. You can import a deck from another instance of the app. This format allows importing cards with or without their associated learning progress.
- **CSV format** lets you import cards from platforms like Quizlet. Simply place one card per line with the front, a comma, and the back.

### Creating a Card
Click on a deck to open it. To add a card, click the **+** button. Enter your content in *Front* and *Back*. If *Alternate front and back* is enabled, each side will be shown alternately during reviews, starting with the front. If *Card to learn* is unchecked, the card will exist but won’t appear in the **Learning** or **Revisions** tabs.

To add the card and return to the deck, click *Add*. To add the card and continue creating more, click *Add and continue creating*.

### Understanding Deck Information
When you open a deck, all its cards are displayed in a list. You’ll see their front, back, and the next revision date for learned cards.

Cards that don’t alternate sides in reviews have a darker back.

Cards not marked for learning have both front and back darkened.

A progress bar shows the learning progress for each card.

If any cards in the deck have been learned, a deck progress bar appears at the top of the page.

### Deck Settings
To access deck settings, click the gear icon in the top-right corner when a deck is open. You can also access it by long-pressing a deck in the Library.
Here, you can:
- Rename the deck.
- Reset its learning progress.
- Delete it.
- View statistics about the deck.

Two export options are available:
- **Export cards** (without learning progress) – Useful for sharing decks with friends.
- **Export with learning progress** – Preserves your work when transferring data.
To export all decks at once, go to the app’s settings page.

### Card Settings
From a deck, click a card to view its details. You can:
- Edit its front and back.
- Toggle the two options seen during creation.
- View learning progress.
- Delete the card or reset its learning progress.

The underlined side (front or back) indicates which side will be shown in the next revision. If *Alternate front and back* is disabled, the front will always be underlined.

### Quick Actions on a Card
From a deck:
- **Long-press an unlearned card** to mark it as learned (due for review the next day).
- **Long-press a learned card** to reset its learning progress.
A confirmation message will appear.

## App Settings
From the **Library** tab, click the gear icon to access app settings. Here, you can:
- Adjust the spacing (in days) for each revision step. Cards that pass the final step remain there.
- Toggle two checkboxes:
  - If the first is checked, forgotten cards return to the **first step**. Otherwise, they only go back one step.
  - If the second is checked, cards that pass the final step **won’t appear in Revisions** (they’re fully learned).
  - If the third is checked, **Advanced Review Mode** is enabled (see *Revisions*).
- Reset settings to default.

The top-right button lets you **import or export decks**:
- Clicking it exports all decks (with learning progress) and prompts you to save the file to your device (useful for backups).
- Long-pressing it lets you import a JSON file containing one or more decks (exported via this button or deck settings).

## Learning
When a card is created, it appears in the **Learning** tab on the right. The deck’s name is displayed in the top-right corner of the card. Click to flip it.

- **Learned**: The card will be due for review tomorrow, and you’ll move to the next card.
- **Review Again**: The card stays in **Learning** (moved to the back of the queue), and you’ll move to the next card.
- **Ignore**: The card won’t appear in **Learning** or **Revisions** until marked for learning again in its settings.

After moving to the next card, a **cancel button** appears in the top-left corner. It lets you revert to the previous card and undo your last action.
The number of cards to learn is displayed in parentheses at the top of the page.

## Revisions
Every day, go to the **Revisions** tab (center) to review cards due that day. The deck’s name is shown in the top-right corner of each card. If a card is reviewed late, the delay is indicated below the deck’s name.

Click a card to flip it.
- **Known**: The card advances to the next step.
- **Forgotten**: The card returns to the first step or the previous step, depending on your settings.

After moving to the next card (by clicking either button), a **cancel button** appears in the top-left corner. It lets you revert to the previous card and undo your action.
The number of cards to review is shown in parentheses at the top. Once all cards are reviewed:
- Forgotten cards reappear and must be reviewed again (they’ll keep reappearing until marked as *Known*).
- Actions at this stage don’t affect the next revision date (calculated during the card’s first presentation).

When all cards are reviewed, you’ll see:
- Today’s stats (cards reviewed, known, forgotten).
- Cards due for review in the next seven days.

### Advanced Review Mode
If enabled (see *App Settings*), you get four buttons for more precision:
- **Known**: No change (card advances normally).
- **Hard**: The card is marked as *Known* (won’t reappear today) but stays at the same step.
- **Almost**: The card is marked as *Forgotten* and returns to the previous step.
- **Forgotten**: The card returns to the **first step**, regardless of your forgetfulness setting.