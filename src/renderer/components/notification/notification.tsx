/*
 * @Author       : Kevin Jobs
 * @Date         : 2022-01-29 20:21:21
 * @LastEditTime : 2022-01-29 21:35:52
 * @lastEditors  : Kevin Jobs
 * @FilePath     : \horen\src\horen\renderer\components\notification\notification.tsx
 * @Description  :
 */
import './style.css';

export interface NotificationProps {}

type NoticeType = 'success' | 'warning' | 'error' | 'default';

interface Notice {
  id: number | string;
  text: string | number;
  type: NoticeType;
}

class Notification {
  protected _notices: Notice[] = [];
  protected _wrapper: HTMLDivElement;
  protected _duration = 2500;

  constructor() {
    this._wrapper = this.createWrapper();
  }

  public set duration(sec: number) {
    this._duration = sec;
  }

  public createWrapper() {
    const el = document.body;
    const child = document.createElement('div');
    child.id = 'notice-wrapper';
    el.appendChild(child);
    return child;
  }

  public add(text: string, typ = 'normal') {
    const child = document.createElement('div');
    const cls = typ === 'flash' ? 'notice-item flash' : 'notice-item';
    child.className = cls;
    child.dataset['key'] = new Date().valueOf().toString();

    switch (typ) {
      case 'flash':
        {
          const first = this._wrapper.children[0];
          if (first) first.innerHTML = text;
          else {
            child.innerHTML = text;
            this._wrapper.appendChild(child);
          }
        }
        break;
      default: {
        child.innerText = text;
        this._wrapper.appendChild(child);
        setTimeout(() => this._wrapper.removeChild(child), this._duration);
      }
    }
  }

  public flash(text: string) {
    this.add(text, 'flash');
  }

  public destory() {
    for (let i = 0; i < this._wrapper.children.length; i++) {
      this._wrapper.removeChild(this._wrapper.children[i]);
    }
  }
}

const notice = new Notification();

export default notice;
