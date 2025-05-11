// Основні змінні гри
const game = {
    player: {
        name: 'tyni',
        side: 'neutral', // 'neutral', 'light', 'dark', 'balance'
        stats: {
            wisdom: 0,      // мудрість (світла сторона)
            power: 0,       // сила (світла сторона)
            intelligence: 0, // інтелект (темна сторона)
            aggression: 0   // агресія (темна сторона)
        }
    },
    
    // Ініціалізація гри
    init: function() {
        console.log('Ініціалізація гри...');

        // Додаємо обробники подій для кнопок вибору
        const choiceButtons = document.querySelectorAll('.choice-btn');
        console.log(`Знайдено ${choiceButtons.length} кнопок вибору`);
        
        choiceButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                console.log(`Клік по кнопці: ${button.textContent}`);
                this.handleChoice(event);
            });
        });

        // Додаємо обробник для кнопки "Розпочати пригоду"
        const startButton = document.querySelector('[data-target="intro"]');
        if (startButton) {
            console.log('Знайдено кнопку старту');
            startButton.addEventListener('click', (event) => {
                console.log('Клік по кнопці старту');
                this.startAdventure(event);
            });
        } else {
            console.error('Кнопка старту не знайдена!');
        }

        // Додаємо обробники для кнопок перезапуску
        const restartButtons = document.querySelectorAll('.restart-btn');
        console.log(`Знайдено ${restartButtons.length} кнопок перезапуску`);
        
        restartButtons.forEach(button => {
            button.addEventListener('click', (event) => {
                console.log('Клік по кнопці перезапуску');
                this.restartGame(event);
            });
        });

        // Показуємо початковий екран
        this.navigateToSection('start');
        console.log('Гра ініціалізована, показано початковий екран');
    },

    // Початок пригоди (перша кнопка)
    startAdventure: function(event) {
        console.log('Запуск пригоди...');
        
        // Отримуємо ім'я персонажа
        const nameInput = document.getElementById('character-name');
        if (!nameInput) {
            console.error('Елемент з ID "character-name" не знайдено!');
            return;
        }
        
        if (nameInput.value.trim() === '') {
            alert('Будь ласка, введіть ім\'я персонажа!');
            return;
        }

        this.player.name = nameInput.value.trim();
        console.log(`Ім'я персонажа: ${this.player.name}`);
        
        // Оновлюємо всі місця, де має бути ім'я
        const playerNameElements = document.querySelectorAll('.player-name, #player-name');
        console.log(`Знайдено ${playerNameElements.length} елементів для відображення імені`);
        
        playerNameElements.forEach(element => {
            element.textContent = this.player.name;
        });

        // Переходимо до екрану вступу
        this.navigateToSection('intro');
        
        // Оновлюємо статистику на екрані
        this.updateStats();
        console.log('Пригода розпочата');
    },

    // Обробка вибору гравця
    handleChoice: function(event) {
        console.log('Обробка вибору...');
        
        const button = event.currentTarget; // Використовуємо currentTarget для надійності
        const targetSection = button.getAttribute('data-target');
        
        if (!targetSection) {
            console.error('Кнопка не має атрибуту data-target!', button);
            return;
        }
        
        console.log(`Вибраний перехід на секцію: ${targetSection}`);
        
        // Оновлюємо статистику на основі вибору
        this.updatePlayerStats(button);
        
        // Визначаємо сторону сили з атрибуту, якщо він є
        if (button.hasAttribute('data-side')) {
            this.player.side = button.getAttribute('data-side');
            console.log(`Встановлена сторона Сили: ${this.player.side}`);
            
            // Додаємо клас для сторони сили до body для стилізації
            document.body.classList.remove('light-side', 'dark-side', 'balance-side');
            if (this.player.side !== 'neutral') {
                document.body.classList.add(this.player.side + '-side');
                console.log(`Додано клас до body: ${this.player.side}-side`);
            }
        }
        
        // Переходимо до вибраної секції
        this.navigateToSection(targetSection);

        // Оновлюємо статистику на екрані
        this.updateStats();
        console.log('Вибір оброблено');
    },

    // Оновлення статистики гравця на основі вибору
    updatePlayerStats: function(button) {
        console.log('Оновлення статистики...');
        
        // Перевіряємо атрибути кнопки для різних статів
        const statsToUpdate = ['wisdom', 'power', 'intelligence', 'aggression'];
        let statsUpdated = false;
        
        statsToUpdate.forEach(stat => {
            const statValue = button.getAttribute(`data-${stat}`);
            if (statValue) {
                const oldValue = this.player.stats[stat];
                this.player.stats[stat] += parseInt(statValue);
                
                // Переконуємося, що значення не менше 0
                if (this.player.stats[stat] < 0) {
                    this.player.stats[stat] = 0;
                }
                
                console.log(`Статистика ${stat}: ${oldValue} -> ${this.player.stats[stat]}`);
                statsUpdated = true;
            }
        });

        if (!statsUpdated) {
            console.log('Жодна статистика не була оновлена (кнопка не має атрибутів data-*)');
        }

        // Визначаємо сторону на основі статистики
        this.determinePlayerSide();
    },

    // Визначення сторони сили на основі статистики
    determinePlayerSide: function() {
        const lightSideScore = this.player.stats.wisdom + this.player.stats.power;
        const darkSideScore = this.player.stats.intelligence + this.player.stats.aggression;
        
        console.log(`Показники сторін: Світла=${lightSideScore}, Темна=${darkSideScore}`);
        
        // Якщо одна зі сторін переважає значно, то гравець схиляється до неї
        const oldSide = this.player.side;
        
        if (lightSideScore > darkSideScore + 3) {
            this.player.side = 'light';
        } else if (darkSideScore > lightSideScore + 3) {
            this.player.side = 'dark';
        } else if (lightSideScore > 0 && darkSideScore > 0) {
            // Якщо показники майже рівні та значні, то це баланс
            this.player.side = 'balance';
        }
        
        if (oldSide !== this.player.side) {
            console.log(`Зміна сторони Сили: ${oldSide} -> ${this.player.side}`);
        }
    },

    // Оновлення відображення статистики
    updateStats: function() {
        console.log('Оновлення відображення статистики...');
        
        // Оновлюємо показники у всіх секціях
        const stats = ['wisdom', 'power', 'intelligence', 'aggression'];
        
        stats.forEach(stat => {
            // Знаходимо всі елементи для даного стату
            const statElements = document.querySelectorAll(`[id^="${stat}"]`);
            console.log(`Знайдено ${statElements.length} елементів для статистики ${stat}`);
            
            statElements.forEach(element => {
                element.textContent = this.player.stats[stat];
            });
        });
    },

    // Навігація між секціями
    navigateToSection: function(sectionId) {
        console.log(`Перехід до секції: ${sectionId}`);
        
        // Перевіряємо, чи існує секція
        const targetSection = document.getElementById(sectionId);
        if (!targetSection) {
            console.error(`Секція з ID "${sectionId}" не знайдена!`);
            return;
        }
        
        // Приховуємо всі секції
        const sections = document.querySelectorAll('.section');
        console.log(`Знайдено ${sections.length} секцій`);
        
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Показуємо вибрану секцію
        targetSection.classList.add('active');
        console.log(`Секція "${sectionId}" активована`);
        
        // Оновлюємо ім'я гравця в цій секції
        const playerNameElements = targetSection.querySelectorAll('.player-name, #player-name');
        console.log(`Знайдено ${playerNameElements.length} елементів для відображення імені в активній секції`);
        
        playerNameElements.forEach(element => {
            element.textContent = this.player.name;
        });
    },

    // Перезапуск гри
    restartGame: function(event) {
        console.log('Перезапуск гри...');
        
        // Скидаємо статистику
        this.player.name = '';
        this.player.side = 'neutral';
        this.player.stats = {
            wisdom: 0,
            power: 0,
            intelligence: 0,
            aggression: 0
        };
        
        // Очищаємо поле вводу імені
        const nameInput = document.getElementById('character-name');
        if (nameInput) {
            nameInput.value = '';
        } else {
            console.error('Елемент з ID "character-name" не знайдено при перезапуску!');
        }
        
        // Видаляємо класи сторін з body
        document.body.classList.remove('light-side', 'dark-side', 'balance-side');
        console.log('Класи сторін видалені з body');
        
        // Переходимо до початкового екрану
        this.navigateToSection('start');
        console.log('Гра перезапущена');
    }
};

// Запускаємо гру після завантаження сторінки
document.addEventListener('DOMContentLoaded', function() {
    console.log('Сторінка завантажена, запуск гри...');
    game.init();
});
