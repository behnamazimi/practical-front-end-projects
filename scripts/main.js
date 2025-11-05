// Project data with descriptions and topics
const projects = [
    {
        id: '01.custom-video-player',
        title: 'Custom Video Player',
        description: 'Customized video controls with manual design. Focus on handling video nodes and implementing custom behavior.',
        banner: 'custom-video-player-ss.jpg',
        topics: ['Video node controls', 'Fullscreen handling', 'CSS variables']
    },
    {
        id: '02.lovely-movies',
        title: 'Lovely Movies',
        description: 'A simple movie search website with API integration and dynamic content loading.',
        banner: 'lovely-movies-ss.jpg',
        topics: ['Promises and Fetch API', 'DOM manipulation', 'CSS positioning', 'CSS variables']
    },
    {
        id: '03.notes-app',
        title: 'Notes App',
        description: 'A practical note web app with categorized notes. Search, edit, and remove functionality included.',
        banner: 'notes-app-ss.jpg',
        topics: ['Object Oriented Programming', 'DOM creation', 'CSS Grid', 'localStorage']
    },
    {
        id: '04.othello-board-game',
        title: 'Othello Board Game',
        description: 'Famous strategy game Othello (Reversi) implemented in pure JavaScript with game logic.',
        banner: 'othello-board-game-ss.jpg',
        topics: ['Object Oriented Programming', 'Game strategy', 'Event handling', 'Error handling']
    },
    {
        id: '05.quiz-app',
        title: 'Quiz App',
        description: 'Interactive quiz application with dynamic questions and animated transitions.',
        banner: 'quiz-app-ss.jpg',
        topics: ['Object Oriented Programming', 'DOM handling', 'CSS animations']
    },
    {
        id: '06.simple-range-slider',
        title: 'Simple Range Slider',
        description: 'Custom range slider implementation with smooth interactions and visual feedback.',
        banner: 'simple-range-slider-ss.jpg',
        topics: ['Prototypal OOP', 'DOM events', 'CSS variables']
    },
    {
        id: '07.web-chat-app',
        title: 'Web Chat App',
        description: 'Real messaging app interface using Web Components with component-based architecture.',
        banner: 'chat-placeholder.svg',
        topics: ['Web Components', 'Object-Oriented Programming', 'Event handling', 'CSS Flexbox']
    },
    {
        id: '08.canvas-wallpaper',
        title: 'Canvas Wallpaper',
        description: 'Animated wallpaper with moving circles using HTML Canvas and mathematical operations.',
        banner: null,
        fallbackIcon: '🌌',
        topics: ['HTML Canvas', 'Animation', 'Mathematical operations']
    },
    {
        id: '09.split-screen',
        title: 'Split Screen',
        description: 'Modern design concept with two resizable sections that respond to mouse interactions.',
        banner: 'img/bg-colored.jpg',
        topics: ['CSS variables', 'Positioning', 'Pseudo classes', 'DOM manipulation']
    },
    {
        id: '10.responsive-font-size',
        title: 'Responsive Font Size',
        description: 'Demonstration of responsive typography techniques for different screen sizes.',
        banner: null,
        fallbackIcon: '📏',
        topics: ['Responsive design', 'CSS units', 'Media queries']
    },
    {
        id: '11.css-escape-loading-animation',
        title: 'Escape Loading Animation',
        description: 'Cool loading animation with pure CSS featuring sliding and floating boxes.',
        banner: null,
        fallbackIcon: '⚡',
        topics: ['CSS Keyframes', 'Transform animations', 'Transform origin']
    },
    {
        id: '12.image-slider-3d',
        title: 'Image Slider 3D',
        description: 'Automatic image slider with 3D animations and hover pause functionality.',
        banner: 'images/img1.png',
        topics: ['3D CSS animations', 'Dynamic keyframes', 'Animation timing']
    }
];

class ProjectsUI {
    constructor() {
        this.projectsGrid = document.getElementById('projectsGrid');
        this.init();
    }

    init() {
        this.showLoading();
        // Simulate loading time for better UX
        setTimeout(() => {
            this.renderProjects();
        }, 500);
    }

    showLoading() {
        this.projectsGrid.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Loading projects...
            </div>
        `;
    }

    renderProjects() {
        this.projectsGrid.innerHTML = '';

        projects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
        });
    }

    createProjectCard(project) {
        const card = document.createElement('div');
        card.className = 'project-card';
        card.setAttribute('data-project-id', project.id);

        const topicsHTML = project.topics.map((topic, index) =>
            `<li class="topic-tag topic-tag--${index % 4}">${topic}</li>`
        ).join('');

        let imageHTML;
        if (project.banner) {
            const bannerPath = `./${project.id}/static/${project.banner}`;
            imageHTML = `
                <img src="${bannerPath}" alt="${project.title}" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                <div class="project-card__fallback" style="display: none;">
                    <span>${project.fallbackIcon || '📱'}</span>
                </div>
            `;
        } else {
            imageHTML = `
                <div class="project-card__fallback">
                    <span>${project.fallbackIcon || '📱'}</span>
                </div>
            `;
        }

        card.innerHTML = `
            <div class="project-card__image">
                ${imageHTML}
            </div>
            <div class="project-card__content">
                <div class="project-card__header">
                    <h3 class="project-card__title">${project.title}</h3>
                    <div class="project-card__number">${String(projects.indexOf(project) + 1).padStart(2, '0')}</div>
                </div>
                <p class="project-card__description">${project.description}</p>
                <div class="project-card__topics">
                    <h4>Skills:</h4>
                    <ul>${topicsHTML}</ul>
                </div>
            </div>
        `;

        // Add click event to the entire card
        card.addEventListener('click', () => {
            this.openProject(project.id);
        });

        return card;
    }

    openProject(projectId) {
        // Open the actual project demo in a new tab
        const baseUrl = window.location.href.replace('/index.html', '').replace(/\/$/, '');
        const projectPath = `${baseUrl}/${projectId}/`;
        window.open(projectPath, '_blank');
    }

    // Method to filter projects (for future enhancement)
    filterProjects(searchTerm) {
        const filteredProjects = projects.filter(project =>
            project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            project.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        this.renderFilteredProjects(filteredProjects);
    }

    renderFilteredProjects(filteredProjects) {
        this.projectsGrid.innerHTML = '';

        if (filteredProjects.length === 0) {
            this.projectsGrid.innerHTML = `
                <div class="loading">
                    <p>No projects found matching your search.</p>
                </div>
            `;
            return;
        }

        filteredProjects.forEach(project => {
            const projectCard = this.createProjectCard(project);
            this.projectsGrid.appendChild(projectCard);
        });
    }
}

// Initialize the projects UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.projectsUI = new ProjectsUI();

    // Add back button functionality for projects
    if (window.location.pathname.includes('/index.html') && window.location.pathname !== '/index.html') {
        addBackButton();
    }
});

// Function to add back button to individual projects
function addBackButton() {
    const backButton = document.createElement('div');
    backButton.className = 'back-button';
    backButton.innerHTML = `
        <button onclick="window.history.back()" class="back-btn">
            ← Back to Projects
        </button>
    `;
    document.body.insertBefore(backButton, document.body.firstChild);
}

// Add some interactive effects
document.addEventListener('DOMContentLoaded', () => {
    // Add smooth scrolling for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add parallax effect to header
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const header = document.querySelector('.header');
        if (header) {
            header.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
});