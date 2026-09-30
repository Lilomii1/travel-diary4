// =========================================================
// main.js — точка входа приложения «Дневник Путешественника»
// Инициализирует все модули в правильном порядке,
// проверяет сессию пользователя и запускает UI.
// =========================================================

(function () {
    'use strict';

    /**
     * Основная функция инициализации приложения.
     * Вызывается после загрузки DOM.
     */
    function initApp() {
        console.log('🌍 Инициализация приложения «Дневник Путешественника»...');

        // ---------------------------------------------------
        // 1. Тема из localStorage
        // ---------------------------------------------------
        if (localStorage.getItem('travel_theme') === 'dark') {
            document.body.classList.add('dark');
        }

        // ---------------------------------------------------
        // 2. Глобальный обработчик клика по карте
        //    Координаты попадают в поля формы поездки.
        // ---------------------------------------------------
        window.__onMapClick = function (lat, lng) {
            const latInput = document.getElementById('tripLat');
            const lngInput = document.getElementById('tripLng');

            if (!latInput || !lngInput) return;

            latInput.value = lat.toFixed(6);
            lngInput.value = lng.toFixed(6);

            // Мигаем полями — визуальная обратная связь
            [latInput, lngInput].forEach(inp => {
                inp.style.transition = 'box-shadow 0.2s';
                inp.style.boxShadow = '0 0 0 3px rgba(79, 70, 229, 0.35)';
                setTimeout(() => { inp.style.boxShadow = ''; }, 500);
            });
        };

        // ---------------------------------------------------
        // 3. Проверка зависимостей
        // ---------------------------------------------------
        const requiredModules = ['Auth', 'Storage', 'PhotoUtils', 'TravelMap'];
        const missing = requiredModules.filter(name => typeof window[name] === 'undefined');

        if (missing.length) {
            console.error('❌ Не загружены модули: ' + missing.join(', '));
            return;
        }

        // ---------------------------------------------------
        // 4. Инициализация карты
        //    Карта инициализируется один раз при старте.
        // ---------------------------------------------------
        if (!window.__mapInited) {
            window.__mapInited = true;

            TravelMap.init({
                // Двойной клик по маркеру в попапе — редактирование
                onEdit: function (id) {
                    const trip = Storage.getById(id);
                    if (trip && typeof window.__openModal === 'function') {
                        window.__openModal(trip);
                    }
                },
                // Удаление поездки
                onDelete: function (id) {
                    const trip = Storage.getById(id);
                    if (!trip) return;
                    if (confirm('Удалить поездку «' + trip.title + '»?')) {
                        Storage.remove(id);
                        if (typeof window.__renderAll === 'function') {
                            window.__renderAll();
                        }
                    }
                }
            });
        }

        // ---------------------------------------------------
        // 5. Запуск UI (определено в app.js)
        // ---------------------------------------------------
        if (typeof window.__appInit === 'function') {
            window.__appInit();
        } else {
            console.error('❌ app.js не загружен или не определил window.__appInit');
            return;
        }

        console.log('✅ Приложение готово к работе.');
    }

    // Запускаем после полной загрузки DOM
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initApp);
    } else {
        // DOM уже загружен (скрипт подключён в конце body)
        initApp();
    }
})();