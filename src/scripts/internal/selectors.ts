export function getNavButtons() {
  return document.querySelector('.js-repo-nav')?.firstElementChild
    ?.lastElementChild;
}

export function getAnchors() {
  const anchors = document.querySelectorAll('a.Link--primary');
  return anchors as NodeListOf<HTMLAnchorElement>;
}

export function getTotalSizeButton() {
  return document.querySelector('.grs-total-size') as HTMLElement | undefined;
}

export function getSizeLabel() {
  return document.querySelector('th.grs-size') as HTMLElement | undefined;
}

export function getThead() {
  return document.querySelector('thead');
}

export function getTotalSizeSpan(totalSizeButton: HTMLElement) {
  return totalSizeButton.querySelector('span');
}
