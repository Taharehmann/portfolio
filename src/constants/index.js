
import {
  logo,
  backend,
  creator,
  mobile,
  web,
  github,
  menu,
  close,
  css,
  gearXpert,
  project2,
  project3,
  mysql,
  express,
  aws,
  mui,

  gsap,
  framer,
  figma,
  git,
  html,
  javascript,
  mongodb,
  nodejs,
  reactjs,
  redux,
  tailwind,
  threejs,
  firstTestimonial,
  secondTestimonial,
  thirdTestimonial,

} from '../assets'


// Import Tekisky separately
import tekisky from "../assets/company/softhrive.png";


export const navLinks = [


  {
    id: "about",
    title: "About",

  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];

const services = [
  {
    title: "Full-Stack Developer",
    icon: web,
  },
  {
    title: "Frontend Developer",
    icon: mobile,
  },
  {
    title: "Backend Developer",
    icon: backend,
  },
  {
    title: "Ui UX Designer",
    icon: creator,
  },
];

const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  {
    name: "gsap",
    icon: gsap,
  },
  {
    name: "framer",
    icon: framer,
  },


  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "figma",
    icon: figma,
  },
  {
    name: "Redux Toolkit",
    icon: redux,
  },
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Material Ui",
    icon: mui,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Express Js",
    icon: express,
  },
  {
    name: "AWS",
    icon: aws,
  },
  {
    name: "MongoDB",
    icon: mongodb,
  },
  {
    name: "MySql",
    icon: mysql,
  },

  {
    name: "git",
    icon: git,
  },



];

const experiences = [
  {
    title: "Flutter Developer Intern",
    company_name: "Softhrive",
    icon: tekisky,
    iconBg: "#383E56",
    date: "May 2025 - present",
    points: [
      "Developing and maintaining mobile applications using Flutter.",
      "Collaborating with cross-functional teams including designers, product managers, and other developers to create high-quality products.",
      "Integrated REST APIs, Firebase, and local databases to ensure seamless data flow and real-time functionality.",
      "Participating in code reviews and providing constructive feedback to other developers.",
    ],
  },
];

const testimonials = [
  {
    testimonial:
      "I thought it was impossible to make a app as beautiful as our product, but Taha proved me wrong.",
    name: "MD Mustaqeem",
    designation: "Ecommerce",
    company: "QuickMart",
    image: firstTestimonial,
  },
  {
    testimonial:
      "I've never met a Flutter developer who truly cares about their clients' success like Taha does.",
    name: "Abdul Rehman",
    designation: "Ecommerce Business",
    company: "justbuyz",
    image: secondTestimonial,
  },
  {
    testimonial:
      "After Taha optimized our app, our traffic increased by 50%. We can't thank them enough!",
    name: "James Wang",
    designation: "CTO",
    company: "456 Enterprises",
    image: thirdTestimonial,
  },
];

const projects = [
  {
    name: "Mentor App",
    description:
      "Prener Mentor is a guidance app that connects learners with mentors. With the help of the app, you can get the right mentorship and achieve your goals. It creates a supportive environment where learning becomes easier and growth more attainable.",
    tags: [
      {
        name: "dart",
        color: "blue-text-gradient",
      },
      {
        name: "cross-platform",
        color: "white-text-gradient",
      },
      {
        name: "firebase",
        color: "pink-text-gradient",
      },
      {
        name: "bloc",
        color: "green-text-gradient",
      },

    ],
    image: project2,
    source_code_link: "https://github.com/",
  },
  {
    name: "Travel App",
    description:
      "A cross-platform travel app built with Flutter that helps users explore destinations, book trips, and plan journeys with ease. It offers a smooth interface, real-time updates, and personalized recommendations to make travel simpler and more enjoyable.",
    tags: [
      {
        name: "dart",
        color: "blue-text-gradient",
      },
      {
        name: "riverpod",
        color: "green-text-gradient",
      },
      {
        name: "firebase",
        color: "pink-text-gradient",
      },
    ],
    image: gearXpert,
    source_code_link: "https://github.com/",
  },
  {
    name: "Resume Maker App",
    description:
      "A Resume Maker app developed with Flutter that allows users to create professional resumes quickly and easily. With customizable templates, user-friendly design, and export options, the app helps job seekers build polished resumes in minutes.",
    tags: [
      {
        name: "dart",
        color: "blue-text-gradient",
      },
      {
        name: "cross-platform",
        color: "white-text-gradient",
      },
      {
        name: "riverpod",
        color: "green-text-gradient",
      },

    ],
    image: project3,
    source_code_link: "https://github.com/",
  },
];

export { services, technologies, experiences, testimonials, projects };
