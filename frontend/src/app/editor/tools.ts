export class MyInlineTool {
  render() {
    const button = document.createElement('button');
    button.type = 'button';
    button.innerText = 'button';
    return button;
  }

  surround(range) {
    console.log('range');
  }

  checkState(selection) {
    /* Check if selection contains your inline tool */
    // if (containsTool) {
    //   this.button.classList.add('active');
    // } else {
    //   this.button.classList.add('active');
    // }
  }
}

export class MarkerTool {
  static get isInline() {
    return true;
  }

  constructor(private button = null, private state = false) {}

  render() {
    this.button = document.createElement('button');
    this.button.type = 'button';
    this.button.textContent = 'M';

    return this.button;
  }

  surround(range: Range) {
    if (this.state) {
      return;
    }
    const selectedText = range.extractContents();
    const mark = document.createElement('MARK');
    mark.appendChild(selectedText);
    range.insertNode(mark);
  }

  checkState(selection: Selection) {
    const text = selection.anchorNode;
    if (!text) {
      return;
    }
    const anchorElement = text instanceof Element ? text : text.parentElement;
    this.state = !!anchorElement.closest('MARK');
  }

}

