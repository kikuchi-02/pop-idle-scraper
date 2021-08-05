import Quill from 'quill';

const Inline = Quill.import('blots/inline');

interface WarningAttributes {
  uuid: string;
  num?: number;
  unknown?: string;
}
export class WarningBlot extends Inline {
  static blotName = 'warning';
  static tagName = 'span';

  static create(value: WarningAttributes): Node {
    const node = super.create();
    if (value.uuid) {
      node.setAttribute('data-warning-uuid', value.uuid);
    }
    if (value.num) {
      node.setAttribute('data-warning-num', value.num);
    }
    if (value.unknown) {
      node.setAttribute('data-warning-unknown', value.unknown);
    }
    return node;
  }

  static formats(node: any): WarningAttributes {
    const format = {} as WarningAttributes;
    const uuid = node.getAttribute('data-warning-uuid');
    if (uuid) {
      format.uuid = uuid;
    }
    const num = node.getAttribute('data-warning-num');
    if (num) {
      format.num = num;
    }
    const unknown = node.getAttribute('data-warning-unknown');
    if (unknown) {
      format.unknown = unknown;
    }
    return format;
  }

  format(name: string, value: WarningAttributes): void {
    if (name === 'warning') {
      if (value) {
        if (value.uuid) {
          this.domNode.setAttribute('data-warning-uuid', value.uuid);
        } else {
          this.domNode.removeAttribute('data-warning-uuid');
        }
        if (value.num) {
          this.domNode.setAttribute('data-warning-num', value.num);
        } else {
          this.domNode.removeAttribute('data-warning-num');
        }
        if (value.unknown) {
          this.domNode.setAttribute('data-warning-unknown', value.unknown);
        } else {
          this.domNode.removeAttribute('data-warning-unknown');
        }
      } else {
        this.domNode.removeAttribute('data-warning-uuid');
        this.domNode.removeAttribute('data-warning-num');
        this.domNode.removeAttribute('data-warning-unknown');
      }
    } else {
      super.format(name, value);
    }
  }
}
