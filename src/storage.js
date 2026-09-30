// =========================================================
// storage.js — модуль работы с localStorage
// Отвечает за чтение/запись/фильтрацию поездок по пользователю.
// =========================================================

const Storage = (() => {
    const KEY = 'travel_diary_trips';

    /** Все поездки (всех пользователей) */
    function allTrips() {
        try { return JSON.parse(localStorage.getItem(KEY)) || []; }
        catch { return []; }
    }

    /** Сохранить массив поездок */
    function saveAll(trips) {
        localStorage.setItem(KEY, JSON.stringify(trips));
    }

    /** Поездки текущего пользователя */
    function getAll() {
        const u = Auth.currentUser();
        if (!u) return [];
        return allTrips().filter(t => t.userId === u.id);
    }

    /** Добавить поездку */
    function add(trip) {
        const u = Auth.currentUser();
        if (!u) throw new Error('Не авторизован');
        const trips = allTrips();
        trip.id = Date.now().toString() + '_' + Math.random().toString(36).slice(2, 6);
        trip.userId = u.id;
        trip.createdAt = new Date().toISOString();
        trips.push(trip);
        saveAll(trips);
        return trip;
    }

    /** Обновить поездку */
    function update(id, updated) {
        const u = Auth.currentUser();
        if (!u) throw new Error('Не авторизован');
        const trips = allTrips();
        const i = trips.findIndex(t => t.id === id && t.userId === u.id);
        if (i === -1) return null;
        trips[i] = { ...trips[i], ...updated, id, userId: u.id };
        saveAll(trips);
        return trips[i];
    }

    /** Удалить поездку */
    function remove(id) {
        const u = Auth.currentUser();
        if (!u) throw new Error('Не авторизован');
        saveAll(allTrips().filter(t => !(t.id === id && t.userId === u.id)));
    }

    /** Получить поездку по id */
    function getById(id) {
        return getAll().find(t => t.id === id) || null;
    }

    /** Заменить все поездки текущего пользователя */
    function replaceMine(newTrips) {
        const u = Auth.currentUser();
        if (!u) throw new Error('Не авторизован');
        const others = allTrips().filter(t => t.userId !== u.id);
        const mine = newTrips.map(t => ({ ...t, userId: u.id }));
        saveAll(others.concat(mine));
    }

    return { getAll, add, update, remove, getById, replaceMine };
})();