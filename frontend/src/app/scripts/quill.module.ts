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

interface LintBlotAttributes {
  uuid: string;
  message: string;
}
export class LintBlot extends Inline {
  static blotName = 'lint';
  static tagName = 'span';

  static create(value: LintBlotAttributes): Node {
    const node = super.create();
    node.setAttribute('data-lint-uuid', value.uuid);
    node.setAttribute('data-lint-message', value.message);
    return node;
  }

  static formats(node: any): LintBlotAttributes {
    const format = {} as LintBlotAttributes;
    const uuid = node.getAttribute('data-lint-uuid');
    if (uuid) {
      format.uuid = uuid;
    }
    const message = node.getAttribute('data-lint-message');
    if (message) {
      format.message = message;
    }
    return format;
  }

  format(name: string, value: LintBlotAttributes): void {
    if (name === 'lint') {
      if (value) {
        if (value.uuid) {
          this.domNode.setAttribute('data-lint-uuid', value.uuid);
        } else {
          this.domNode.removeAttribute('data-lint-uuid');
        }

        if (value.message) {
          this.domNode.setAttribute('data-lint-message', value.uuid);
        } else {
          this.domNode.removeAttribute('data-lint-message');
        }
      } else {
        this.domNode.removeAttribute('data-lint-uuid');
        this.domNode.removeAttribute('data-lint-message');
      }
    } else {
      super.format(name, value);
    }
  }
}
