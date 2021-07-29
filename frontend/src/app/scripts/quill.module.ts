import Quill from 'quill';

const Inline = Quill.import('blots/inline');

interface CommentBlotAttributes {
  uuid: string;
}
export class CommentBlot extends Inline {
  static blotName = 'comment';
  static tagName = 'mark';

  static create(value: CommentBlotAttributes): Node {
    const node = super.create();
    node.setAttribute('data-comment-uuid', value.uuid);
    return node;
  }

  static formats(node: any): CommentBlotAttributes {
    const format = {} as CommentBlotAttributes;
    const uuid = node.getAttribute('data-comment-uuid');
    if (uuid) {
      format.uuid = uuid;
    }
    return format;
  }

  format(name: string, value: CommentBlotAttributes): void {
    if (name === 'comment') {
      if (value) {
        if (value.uuid) {
          this.domNode.setAttribute('data-comment-uuid', value.uuid);
        } else {
          this.domNode.removeAttribute('data-comment-uuid');
        }
      } else {
        this.domNode.removeAttribute('data-comment-uuid');
      }
    } else {
      super.format(name, value);
    }
  }
}
