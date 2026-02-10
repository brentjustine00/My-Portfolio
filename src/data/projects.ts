export type Project = {
  title: string
  description: string
  skills: string[]
  images: { src: string; alt: string }[]
  link: string
}

export const projects: Project[] = [
  {
    title: 'Eye Health Detection',
    description:
      'A simple mobile application developed using Flutter that detects potential eye diseases through image analysis. The system uses a computer vision model built with TensorFlow Lite, powered by the InceptionV3 architecture, to classify eye images and identify possible conditions. Designed for on-device inference, the app provides fast and efficient predictions while maintaining a user-friendly interface, demonstrating the practical use of AI and mobile development in healthcare screening support.',
    skills: ['Flutter', 'TensorFlow Lite', 'Computer Vision', 'On-device Inference'],
    images: [
      {
        src: '/projects/eye%20dashboard.jpg',
        alt: 'Eye Health Detection mobile app prediction screen',
      },
    ],
    link: 'https://github.com/',
  },
  {
    title: 'Student Portfolio & AI-Powered Learning Platform',
    description:
      'A full-stack web application that allows students to showcase projects, track progress, and receive AI-generated feedback. Users can securely register, submit projects in multiple file formats, and view AI-generated summaries, performance scores, and personalized learning paths. Built with a modern, responsive UI, the platform serves as a smarter alternative to traditional classroom portfolio systems.',
    skills: ['Full-Stack Development', 'Computer Science Education', 'AI Feedback', 'Responsive UI'],
    images: [
      {
        src: '/projects/AI%20overview.jpg',
        alt: 'AI overview screen with project analysis',
      },
      {
        src: '/projects/Ai%20suggestions.jpg',
        alt: 'AI suggestions and scoring screen',
      },
      {
        src: '/projects/Login%20page.jpg',
        alt: 'Login page for the student portfolio platform',
      },
    ],
    link: 'https://github.com/',
  },
  {
    title: 'Web Python Simulation',
    description:
      'A web-based simulation built with Python that models customer flow in a coffee shop environment. The system simulates customer arrivals, order processing, queue behavior, and service times to analyze operational efficiency. It helps visualize real-world scenarios such as peak hours, waiting times, and resource utilization, providing insights into customer experience and workflow optimization through an interactive web interface.',
    skills: ['Python', 'Simulation', 'Data Visualization', 'Web Apps'],
    images: [
      {
        src: '/projects/graph.jpg',
        alt: 'Coffee shop simulation dashboard with charts',
      },
      {
        src: '/projects/Settings%20and%20control.jpg',
        alt: 'Simulation controls and metrics view',
      },
    ],
    link: 'https://github.com/',
  },
]
