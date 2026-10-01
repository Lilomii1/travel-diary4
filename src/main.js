(function initApp() {
    console.log('🌍 Инициализация приложения «Дневник Путешественника»...');
    document.addEventListener('DOMContentLoaded', () => {
        if (localStorage.getItem('travel_theme') === 'dark') {
            document.body.classList.add('dark');
        }
        window.__onMapClick = (lat, lng) => {
            const latInput = document.getElementById('tripLat');
            const lngInput = document.getElementById('tripLng');
            if (!latInput || !lngInput) return;

            latInput.value = lat.toFixed(6);
            lngInput.value = lng.toFixed(6);

            [latInput, lngInput].forEach(inp => {
                inp.style.transition = 'box-shadow 0.2s';
                inp.style.boxShadow = '0 0 0 3px rgba(79,70,229,.35)';
                setTimeout(() => { inp.style.boxShadow = ''; }, 500);
            });
        };
        if (typeof window.__appInit === 'function') {
            window.__appInit();
        } else {
            console.error('❌ app.js не загружен или не определил __appInit');
        }

        console.log('✅ Приложение готово к работе.');
    });
})();