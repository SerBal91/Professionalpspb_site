// Анимация кнопки "Наверх"
const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ===== EMAILJS НАСТРОЙКИ =====
// ВСТАВЬ СВОИ ДАННЫЕ:
const EMAILJS_PUBLIC_KEY = 8-frIyN7FKjEHZQw7;     // Из шага 4
const EMAILJS_SERVICE_ID = professionalpspb;     // Из шага 2
const EMAILJS_TEMPLATE_ID = template_v3b09uy;   // Из шага 3

// Инициализация EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

// ===== ОБРАБОТКА ФОРМЫ =====
const callbackForm = document.getElementById('callbackForm');
const formNotification = document.getElementById('formNotification');
const formLoading = document.getElementById('formLoading');
const submitBtn = document.getElementById('submitBtn');

// Маска для телефона (улучшенная)
const phoneInput = document.getElementById('userPhone');
if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length > 0) {
            // Формат: +7 (999) 999-99-99
            if (value.length <= 1) {
                value = '+7';
            } else if (value.length <= 4) {
                value = '+7 (' + value.substring(1, 4);
            } else if (value.length <= 7) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7);
            } else if (value.length <= 9) {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9);
            } else {
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }
        }
        
        e.target.value = value;
    });
}

// Отправка формы
callbackForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Получаем данные
    const name = document.getElementById('userName')?.value || 'Не указано';
    const phone = phoneInput.value;
    
    // Простая валидация
    if (!phone || phone.replace(/\D/g, '').length < 11) {
        showNotification('Пожалуйста, введите полный номер телефона', 'error');
        return;
    }
    
    // Показываем загрузку
    setLoading(true);
    
    // Подготавливаем данные для отправки
    const templateParams = {
        user_name: name,
        user_phone: phone,
        user_time: new Date().toLocaleString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }),
        user_page: window.location.href,
        to_email: 'твой_email@example.com' // Твой email для получения уведомлений
    };
    
    try {
        // Отправляем через EmailJS
        const response = await emailjs.send(
            EMAILJS_SERVICE_ID,
            EMAILJS_TEMPLATE_ID,
            templateParams
        );
        
        if (response.status === 200) {
            showNotification('✅ Спасибо! Я перезвоню в течение 30 минут.', 'success');
            callbackForm.reset(); // Очищаем форму
        } else {
            throw new Error('Ошибка отправки');
        }
    } catch (error) {
        console.error('EmailJS Error:', error);
        showNotification('❌ Ошибка отправки. Позвоните по телефону: +7 (911) 123-45-67', 'error');
    } finally {
        setLoading(false);
    }
});

// Вспомогательные функции
function setLoading(isLoading) {
    if (isLoading) {
        formLoading.style.display = 'block';
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.5';
    } else {
        formLoading.style.display = 'none';
        submitBtn.disabled = false;
        submitBtn.style.opacity = '1';
    }
}

function showNotification(message, type) {
    formNotification.textContent = message;
    formNotification.className = 'form-notification ' + type;
    formNotification.style.display = 'block';
    
    // Автоматически скрываем через 5 секунд
    setTimeout(() => {
        formNotification.style.display = 'none';
    }, 5000);
}


// Плавная прокрутка для ссылок в футере
document.querySelectorAll('.footer-list a, .footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        
        // Прокручиваем только к якорям на этой странице
        if (href.startsWith('#')) {
            e.preventDefault();
            const targetId = href.substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80, // Учитываем фиксированную шапку
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
        }
    });
}, observerOptions);

// Наблюдаем за всеми карточками и секциями
document.querySelectorAll('.service-card, .contact-item, .footer-title').forEach(element => {
    observer.observe(element);
});