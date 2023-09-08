/**
 * Input System
 * Description: TODO
 */

type KeyInfo = {
  isPressed: boolean;
  wasClicked: boolean;
  wasReleased: boolean;
};

type WheelInfo = {
  negative: boolean;
  positive: boolean;
};

export class Input {
  private _keys: Map<string, KeyInfo | WheelInfo>;

  constructor() {
    this._keys = new Map();
    this.init();
  }

  init(): void {
    document.addEventListener('keydown', (keydownEvent) => {
      const keyName = keydownEvent.key;
      if (!this._keys.has(keyName)) {
        this._initKey(keyName);
      }

      const key = this._keys.get(keyName) as KeyInfo;
      key.wasClicked = !key.isPressed;
      key.isPressed = true;
      key.wasReleased = false;
    });

    document.addEventListener('keyup', (keyupEvent) => {
      const key = this._keys.get(keyupEvent.key) as KeyInfo;
      key.isPressed = false;
      key.wasClicked = false;
      key.wasReleased = true;
    });
    // document.addEventListener('wheel', (wheelEvent) => {
    //   if (!this._keys.has('wheel')) {
    //     this._initWheel('wheel');
    //   }

    //   const key = this._keys.get('wheel') as WheelInfo;
    //   if (wheelEvent.deltaY < 0) {
    //     key.negative = true;
    //   } else if (wheelEvent.deltaY > 0) {
    //     key.positive = true;
    //   }
    // });
  }

  getKeyDown(keyName: string): boolean {
    if (this._keys.has(keyName)) {
      const key = this._keys.get(keyName) as KeyInfo;
      const wasClicked = key.wasClicked;
      key.wasClicked = false;
      return wasClicked;
    }
    return false;
  }

  getKeyUp(keyName: string): boolean {
    if (this._keys.has(keyName)) {
      const key = this._keys.get(keyName) as KeyInfo;
      const wasReleased = key.wasReleased;
      key.wasReleased = false;
      return wasReleased;
    }
    return false;
  }

  getKeyPressed(keyName: string): boolean {
    if (this._keys.has(keyName)) {
      const { isPressed } = this._keys.get(keyName) as KeyInfo;
      return isPressed;
    }
    return false;
  }

  private _initKey(key: string) {
    this._keys.set(key, {
      isPressed: false,
      wasClicked: false,
      wasReleased: false,
    });
  }

  // private _initWheel(key: string) {
  //   this._keys.set(key, {
  //     negative: false,
  //     positive: false,
  //   });
  // }


}

export const input = new Input();
