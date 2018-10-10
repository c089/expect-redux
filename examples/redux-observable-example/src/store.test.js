require('./store');
const rxjs = require('rxjs');
const {of, VirtualTimeScheduler} = rxjs;
const {toArray, delay, filter, mapTo, throttleTime} = require('rxjs/operators');

const { TestScheduler } = require('rxjs/testing');

const pingEpic = action$ => action$.pipe(
    filter(action => action.type === 'PING'),
    mapTo({ type: 'PONG' })
);

const expectObservable = observable$ => {
    return observable$.pipe(toArray()).toPromise();
}

it('ping example', () => {
    const action$ = of({type: 'PING'});
    const epic$ = pingEpic(action$);

    return expectObservable(epic$).then(value => {
        expect(value).toEqual([{type: 'PONG'}]);
    });
});

it('delayed pong example', () => {

    const scheduler = new TestScheduler();

    const delayedPingEpic = action$ => action$.pipe(
        filter(action => action.type === 'PING'),
        mapTo({ type: 'PONG' }),
        delay(1, scheduler)
    );
    const action$ = of({type: 'PING'});
    const epic$ = delayedPingEpic(action$);

    scheduler.flush();
    scheduler.expectSubscriptions().toBe([1,2,3]);

    return expectObservable(epic$).then(value => {
        expect(value).toEqual([{type: 'PONG'}]);
    });
});


it('allows to do stuff synchronously', () => {
    const scheduler = new TestScheduler((actual, expected) => {
        expect(actual).toEqual(expected);
    });

    scheduler.run(helpers => {
        const { cold, expectObservable, expectSubscriptions } = helpers;
        const e1 =  cold('-a--b--c---|');
        const subs =     '^----------!';
        const expected = '-a-----c---|';

        expectObservable(e1.pipe(throttleTime(3, scheduler))).toBe(expected);
        expectSubscriptions(e1.subscriptions).toBe(subs);
    });
});
