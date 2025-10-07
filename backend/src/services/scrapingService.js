import axios from 'axios';
import * as cheerio from 'cheerio';

const COURSE_SOURCES = {
  COURSERA: 'coursera',
  UDEMY: 'udemy',
  EDUNEXT: 'edunext',
  KHAN_ACADEMY: 'khan-academy'
};

// Mock data for demonstration - in production, implement actual scraping
const mockCourseData = [
  {
    id: 'coursera-ml-stanford',
    title: 'Machine Learning',
    provider: 'Coursera',
    instructor: 'Andrew Ng',
    category: 'Computer Science',
    level: 'Intermediate',
    description: 'Learn about machine learning algorithms and their practical applications',
    duration: '11 weeks',
    price: '$49/month',
    rating: 4.9,
    students: 4200000,
    url: 'https://www.coursera.org/learn/machine-learning',
    skills: ['Machine Learning', 'Python', 'Statistics', 'Data Analysis'],
    certificate: true,
    source: COURSE_SOURCES.COURSERA
  },
  {
    id: 'udemy-web-dev-bootcamp',
    title: 'The Complete Web Developer Bootcamp 2024',
    provider: 'Udemy',
    instructor: 'Colt Steele',
    category: 'Web Development',
    level: 'Beginner',
    description: 'Learn web development from scratch with HTML, CSS, JavaScript, Node.js, React, and more',
    duration: '63.5 hours',
    price: '$84.99',
    rating: 4.7,
    students: 893000,
    url: 'https://www.udemy.com/course/the-complete-web-development-bootcamp/',
    skills: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'MongoDB'],
    certificate: true,
    source: COURSE_SOURCES.UDEMY
  },
  {
    id: 'coursera-data-science-johns-hopkins',
    title: 'Data Science Specialization',
    provider: 'Coursera',
    instructor: 'Johns Hopkins University',
    category: 'Data Science',
    level: 'Intermediate',
    description: 'Master data science fundamentals and build a portfolio of projects',
    duration: '11 months',
    price: '$49/month',
    rating: 4.6,
    students: 650000,
    url: 'https://www.coursera.org/specializations/jhu-data-science',
    skills: ['R', 'Data Science', 'Statistics', 'Machine Learning', 'Data Visualization'],
    certificate: true,
    source: COURSE_SOURCES.COURSERA
  },
  {
    id: 'udemy-python-complete',
    title: 'Complete Python Developer in 2024: Zero to Mastery',
    provider: 'Udemy',
    instructor: 'Andrei Neagoie',
    category: 'Programming',
    level: 'Beginner',
    description: 'Learn Python programming from scratch and become a professional developer',
    duration: '30.5 hours',
    price: '$84.99',
    rating: 4.6,
    students: 456000,
    url: 'https://www.udemy.com/course/complete-python-developer-zero-to-mastery/',
    skills: ['Python', 'Web Development', 'Machine Learning', 'Data Science', 'Automation'],
    certificate: true,
    source: COURSE_SOURCES.UDEMY
  },
  {
    id: 'coursera-google-it-support',
    title: 'Google IT Support Professional Certificate',
    provider: 'Coursera',
    instructor: 'Google',
    category: 'Information Technology',
    level: 'Beginner',
    description: 'Prepare for a career in IT support with hands-on training',
    duration: '3-6 months',
    price: '$49/month',
    rating: 4.7,
    students: 820000,
    url: 'https://www.coursera.org/professional-certificates/google-it-support',
    skills: ['IT Support', 'Troubleshooting', 'Customer Service', 'Linux', 'System Administration'],
    certificate: true,
    source: COURSE_SOURCES.COURSERA
  },
  {
    id: 'udemy-aws-certified-solutions-architect',
    title: 'AWS Certified Solutions Architect Associate',
    provider: 'Udemy',
    instructor: 'Stephane Maarek',
    category: 'Cloud Computing',
    level: 'Intermediate',
    description: 'Pass the AWS Solutions Architect Associate certification exam',
    duration: '27 hours',
    price: '$94.99',
    rating: 4.7,
    students: 456000,
    url: 'https://www.udemy.com/course/aws-certified-solutions-architect-associate-saa-c03/',
    skills: ['AWS', 'Cloud Computing', 'Architecture', 'DevOps', 'Security'],
    certificate: true,
    source: COURSE_SOURCES.UDEMY
  }
];

export const fetchCoursesFromPlatforms = async (filters = {}) => {
  try {
    // In production, implement actual scraping here
    // For now, return mock data with applied filters
    
    let filteredCourses = [...mockCourseData];
    
    if (filters.provider) {
      filteredCourses = filteredCourses.filter(course => 
        course.provider.toLowerCase() === filters.provider.toLowerCase()
      );
    }
    
    if (filters.category) {
      filteredCourses = filteredCourses.filter(course => 
        course.category.toLowerCase().includes(filters.category.toLowerCase())
      );
    }
    
    if (filters.level) {
      filteredCourses = filteredCourses.filter(course => 
        course.level.toLowerCase() === filters.level.toLowerCase()
      );
    }
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredCourses = filteredCourses.filter(course => 
        course.title.toLowerCase().includes(searchTerm) ||
        course.description.toLowerCase().includes(searchTerm) ||
        course.skills.some(skill => skill.toLowerCase().includes(searchTerm))
      );
    }
    
    return filteredCourses;
  } catch (error) {
    console.error('Error fetching courses from platforms:', error);
    return [];
  }
};

export const scrapeCoursera = async (searchTerm = '') => {
  // Placeholder for actual Coursera scraping
  // In production, implement with proper scraping techniques
  return mockCourseData.filter(course => course.source === COURSE_SOURCES.COURSERA);
};

export const scrapeUdemy = async (searchTerm = '') => {
  // Placeholder for actual Udemy scraping
  // In production, implement with proper scraping techniques
  return mockCourseData.filter(course => course.source === COURSE_SOURCES.UDEMY);
};

export const getAllAvailableCourses = async (filters = {}) => {
  try {
    const courses = await fetchCoursesFromPlatforms(filters);
    return courses.map(course => ({
      id: course.id,
      title: course.title,
      provider: course.provider,
      instructor: course.instructor,
      category: course.category,
      level: course.level,
      description: course.description,
      duration: course.duration,
      price: course.price,
      rating: course.rating,
      students: course.students,
      url: course.url,
      skills: course.skills,
      certificate: course.certificate
    }));
  } catch (error) {
    console.error('Error getting all available courses:', error);
    throw error;
  }
};