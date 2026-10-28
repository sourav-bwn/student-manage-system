process.env.TZ = 'Asia/Kolkata'; // pin IST so the UTC-date regression is testable
// Regression tests for student-manage-system (index.html + js/app.js).
// The app is a browser SPA, so it runs in a vm with a small DOM stub.
const test = require('node:test');
const assert = require('node:assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const APP_JS = path.join(__dirname, '..', 'js', 'app.js');

function localTodayExpected() {
    const n = new Date();
    return `${n.getFullYear()}-${String(n.getMonth() + 1).padStart(2, '0')}-${String(n.getDate()).padStart(2, '0')}`;
}

function makeEl(id) {
    return {
        id,
        value: '',
        checked: false,
        textContent: '',
        innerHTML: '',
        className: '',
        style: {},
        listeners: {},
        onclick: null,
        classList: { toggle() {}, add() {}, remove() {}, contains() { return false; } },
        addEventListener(ev, fn) { (this.listeners[ev] ||= []).push(fn); },
        removeEventListener() {},
        appendChild() {},
        cloneNode() { return this; },
        parentNode: { replaceChild() {} },
        fire(ev) { (this.listeners[ev] || []).forEach(f => f({ target: this })); if (this.onclick) this.onclick({ target: this }); },
    };
}

function boot() {
    const elements = {};
    const getEl = id => (elements[id] ||= makeEl(id));
    const store = {};
    const radios = {};
    const alerts = [];
    const docListeners = {};
    const ctx = {
        console,
        Chart: class { constructor() {} destroy() {} },
        alert: msg => alerts.push(String(msg)),
        confirm: () => true,
        location: { reload() {} },
        localStorage: {
            getItem: k => (k in store ? store[k] : null),
            setItem: (k, v) => { store[k] = String(v); },
            removeItem: k => { delete store[k]; },
        },
        sessionStorage: {
            getItem: () => null,
            setItem() {},
            removeItem() {},
        },
        document: {
            getElementById: getEl,
            querySelector(sel) {
                const m = sel.match(/input\[name="att_(\d+)"\]:checked/);
                if (m) return radios[m[1]] || null;
                return null;
            },
            querySelectorAll: () => [],
            addEventListener(ev, fn) { (docListeners[ev] ||= []).push(fn); },
            body: makeEl('body'),
        },
        setInterval() { return 0; },
        clearInterval() {},
        setTimeout() { return 0; },
        clearTimeout() {},
    };
    ctx.window = ctx;
    vm.createContext(ctx);
    vm.runInContext(fs.readFileSync(APP_JS, 'utf8'), ctx);
    vm.runInContext(`this.SMS = {
        get state() { return state; },
        localToday: typeof localToday !== 'undefined' ? localToday : null,
        submitAttendance, openResultModal, renderTakeAttendance, getData
    };`, ctx);
    (docListeners['DOMContentLoaded'] || []).forEach(f => f());
    return { ctx, elements, radios, alerts, el: getEl };
}

function seedApp(t) {
    const SMS = t.ctx.SMS;
    SMS.state.user = { id: 9, name: 'T', email: 't@t', role: 'staff' };
    SMS.state.data = {
        users: [],
        staff: [],
        students: [
            { id: 1, name: 'Ann', courseId: 1, semester: 1 },
            { id: 2, name: 'Ben', courseId: 1, semester: 1 },
        ],
        courses: [{ id: 1, name: 'BCA' }],
        subjects: [{ id: 1, name: 'Python', code: 'CS101', courseId: 1, semester: 1 }],
        attendance: [],
        results: [],
        leaves: [],
        feedback: [],
        nextId: { staff: 1, students: 3, courses: 2, subjects: 2, attendance: 1, results: 1, leaves: 1, feedback: 1 },
    };
}

test('date fields default to the local calendar day, not UTC', () => {
    const t = boot();
    const SMS = t.ctx.SMS;
    const expected = localTodayExpected();
    assert.strictEqual(typeof SMS.localToday, 'function', 'localToday helper exists');
    assert.match(SMS.localToday(), /^\d{4}-\d{2}-\d{2}$/);
    assert.strictEqual(SMS.localToday(), expected);
    seedApp(t);
    const container = makeEl('main');
    SMS.renderTakeAttendance(container);
    assert.ok(container.innerHTML.includes(`id="attDate" value="${expected}"`), 'attendance date defaults to local today');
});

test('IST just after midnight: UTC date is yesterday, localToday stays correct', () => {
    const t = boot();
    const SMS = t.ctx.SMS;
    // 00:30 on Oct 28 in India is 19:00 on Oct 27 UTC.
    const justAfterMidnightIST = new Date(2026, 9, 28, 0, 30);
    assert.strictEqual(justAfterMidnightIST.toISOString().split('T')[0], '2026-10-27',
        'sanity: the UTC day really is the previous day here (the original bug)');
    assert.strictEqual(SMS.localToday(justAfterMidnightIST), '2026-10-28',
        'localToday returns the local calendar day');
});

test('re-marking the same date updates attendance instead of duplicating it', () => {
    const t = boot();
    const SMS = t.ctx.SMS;
    seedApp(t);
    t.el('attCourse').value = '1';
    t.el('attSubject').value = '1';
    t.el('attDate').value = '2026-10-28';
    t.el('attSemester').value = '1';
    t.radios['1'] = { value: 'present' };
    t.radios['2'] = { value: 'absent' };

    SMS.submitAttendance();
    assert.strictEqual(SMS.state.data.attendance.length, 2, 'first save creates one record per student');

    t.radios['2'] = { value: 'present' };
    SMS.submitAttendance();
    const att = SMS.state.data.attendance;
    assert.strictEqual(att.length, 2, 're-marking the same date must not duplicate records');
    assert.deepStrictEqual(att.map(a => a.status).sort(), ['present', 'present'], 'statuses updated in place');
});

test('marking a different date appends new records', () => {
    const t = boot();
    const SMS = t.ctx.SMS;
    seedApp(t);
    t.el('attCourse').value = '1';
    t.el('attSubject').value = '1';
    t.el('attSemester').value = '1';
    t.radios['1'] = { value: 'present' };
    t.radios['2'] = { value: 'present' };
    t.el('attDate').value = '2026-10-28';
    SMS.submitAttendance();
    t.el('attDate').value = '2026-10-29';
    SMS.submitAttendance();
    assert.strictEqual(SMS.state.data.attendance.length, 4, 'a new date is a new set of records');
});

test('result scores are clamped to 0-100 on save', () => {
    const t = boot();
    const SMS = t.ctx.SMS;
    seedApp(t);
    SMS.openResultModal();
    t.el('resultStudent').value = '1';
    t.el('resultSubject').value = '1';
    t.el('resultScore').value = '150';
    t.el('resultRemarks').value = '';
    t.el('modalSave').fire('click');
    assert.strictEqual(SMS.state.data.results.length, 1);
    assert.strictEqual(SMS.state.data.results[0].score, 100, 'typed score above 100 is clamped');
});

test('blank score is rejected instead of stored as NaN', () => {
    const t = boot();
    const SMS = t.ctx.SMS;
    seedApp(t);
    SMS.openResultModal();
    t.el('resultStudent').value = '1';
    t.el('resultSubject').value = '1';
    t.el('resultScore').value = '';
    t.el('modalSave').fire('click');
    assert.strictEqual(SMS.state.data.results.length, 0, 'nothing stored');
    assert.ok(t.alerts.some(a => a.includes('required')), 'user told the score is required');
});
