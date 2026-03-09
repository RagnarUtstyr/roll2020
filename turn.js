let currentHighlightIndex = 0;

window.roundCounter = window.roundCounter ?? 1;

window.updateRoundDisplay = function updateRoundDisplay() {
    const el = document.getElementById('round-value');
    if (el) el.textContent = window.roundCounter;
};

window.resetRoundCounter = function resetRoundCounter() {
    window.roundCounter = 1;
    window.updateRoundDisplay();
};

let __trackerPrevEntryId = null;

function highlightCurrentEntry(emitEvent = false, reason = "sync") {
    const listItems = document.querySelectorAll('#rankingList li');

    if (listItems.length === 0) {
        return;
    }

    if (currentHighlightIndex >= listItems.length) {
        currentHighlightIndex = Math.min(currentHighlightIndex, listItems.length - 1);
    }

    listItems.forEach(item => item.classList.remove('highlighted'));

    const currentItem = listItems[currentHighlightIndex];
    currentItem.classList.add('highlighted');

    if (emitEvent) {
        const currentId = currentItem?.dataset?.entryId ?? null;
        const previousId = __trackerPrevEntryId;

        if (currentId && currentId !== previousId) {
            window.dispatchEvent(new CustomEvent('tracker:highlightChange', {
                detail: {
                    previousId,
                    currentId,
                    index: currentHighlightIndex,
                    roundCounter: window.roundCounter ?? 1,
                    reason
                }
            }));
        }

        __trackerPrevEntryId = currentId;
    } else {

        const currentId = currentItem?.dataset?.entryId ?? null;
        if (currentId) __trackerPrevEntryId = currentId;
    }
}

function moveToNextEntry() {
    const listItems = document.querySelectorAll('#rankingList li');
    if (listItems.length === 0) return;

    const wasLast = currentHighlightIndex === listItems.length - 1;

    currentHighlightIndex = (currentHighlightIndex + 1) % listItems.length;

    if (wasLast && currentHighlightIndex === 0) {
        window.roundCounter = (window.roundCounter ?? 1) + 1;
        window.updateRoundDisplay?.();
    }

    highlightCurrentEntry(true, "next");
}

function moveToPreviousEntry() {
    const listItems = document.querySelectorAll('#rankingList li');
    if (listItems.length === 0) return;

    currentHighlightIndex = (currentHighlightIndex - 1 + listItems.length) % listItems.length;

    highlightCurrentEntry(true, "prev");
}

function refreshHighlightAfterRemoval() {
    const listItems = document.querySelectorAll('#rankingList li');

    if (listItems.length === 0) {
        currentHighlightIndex = 0;
        __trackerPrevEntryId = null;
        return;
    }

    if (currentHighlightIndex >= listItems.length) {
        currentHighlightIndex = Math.min(currentHighlightIndex, listItems.length - 1);
    }

    highlightCurrentEntry(false, "sync");
}

function removeEntry(listItem) {
    const listItems = document.querySelectorAll('#rankingList li');
    const indexToRemove = Array.from(listItems).indexOf(listItem);

    listItem.remove();

    if (currentHighlightIndex >= indexToRemove) {
        currentHighlightIndex = Math.max(0, currentHighlightIndex - 1);
    }

    refreshHighlightAfterRemoval();
}

function ensureHighlightAlwaysVisible() {
    const observer = new MutationObserver(() => {
        highlightCurrentEntry(false, "sync");
    });

    const listElement = document.getElementById('rankingList');
    if (listElement) {
        observer.observe(listElement, { childList: true, subtree: false });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const nextButton = document.getElementById('next-button');
    if (nextButton) nextButton.addEventListener('click', moveToNextEntry);

    const resetRoundButton = document.getElementById('reset-round-button');
    if (resetRoundButton) {
        resetRoundButton.addEventListener('click', () => {
            window.resetRoundCounter?.();

            highlightCurrentEntry(false, "sync");
        });
    }

    const prevButton = document.getElementById('prev-button');
    if (prevButton) prevButton.addEventListener('click', moveToPreviousEntry);

    highlightCurrentEntry(false, "sync");
    window.updateRoundDisplay?.();

    ensureHighlightAlwaysVisible();
});