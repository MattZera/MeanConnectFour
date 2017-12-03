import { Injectable, OnDestroy } from '@angular/core';
import * as socketio from 'socket.io-client';
import { Observable, Subject } from "rxjs/Rx";


@Injectable()
export class SocketService implements OnDestroy {

  private connectionObservable: Observable<any>;
  private connections: any = {};
  private sendSubject: Subject<any>;
  private socket;

  constructor() {

    //construct the message subject
    this.sendSubject = new Subject();

    //create new observable on subscription
    this.connectionObservable = Observable.defer(() =>
      //create the observable
      Observable.create((observer) => {
        //connect to the socket
        this.socket = socketio.connect();

        //subscribe to messages sent
        var subscription = this.sendSubject.subscribe((message) => this.socket.emit(message.label, message.data));

        observer.next(this.socket);

        //cleanup and close the connection
        return function () {
          subscription.unsubscribe();
          this.socket.disconnect();
        }
      }
      )).publishReplay().refCount();

  }

  ngOnDestroy(): void {
    this.sendSubject.complete();
  }

  public messages(label: string): Observable<any> {
    //returns a new observable mapped to a function
    if (!this.connections[label]) {
      this.connections[label] = this.connectionObservable
        .switchMap((socket) => Observable.fromEvent(socket, label))
        .finally(() => this.connections[label] = null)
        .share();
    }
    return this.connections[label];
  }

  public send(label: string, data: any = {}) {
    this.sendSubject.next({ label: label, data: data });
  }

  public receive(label: string, callback: (data: any) => any) {
    this.socket.on(label, callback);
  }
}
