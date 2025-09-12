INSERT INTO portfolio_items
(title, category, description, image, problem, solution, results, tech_stack, active)
VALUES
(
    'E-commerce Platform',
    'Web Development',
    'A high-performance online store with custom checkout flow.',
    'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Client needed a scalable e-commerce solution to replace their outdated platform.',
    'Built a React frontend with Node.js backend, MongoDB database, and Stripe integration.',
    'Increased conversion rate by 35%, reduced page load time by 60%, and handled 2x more traffic.',
    '["React","Node.js","Express","MongoDB","Stripe API","Redux"]'::jsonb,
    true
),
(
    'Health & Fitness App',
    'Mobile Development',
    'Personalized workout and nutrition tracking application.',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Fitness startup needed a cross-platform app for tracking workouts and nutrition.',
    'Developed a React Native app with Firebase backend, integrating health APIs.',
    '100,000+ downloads in first 3 months, 4.8/5 app store rating, 75% user retention.',
    '["React Native","Firebase","Google Fit API","Apple HealthKit","Redux"]'::jsonb,
    true
),
(
    'Enterprise Dashboard',
    'Cloud Solutions',
    'Real-time analytics dashboard for business intelligence.',
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Corporation needed a unified dashboard to visualize multiple data sources in real-time.',
    'Created cloud-based solution with AWS services, React frontend, and D3.js visualizations.',
    'Reduced decision-making time by 40%, consolidated 5 tools into one platform, saved $250k/year.',
    '["AWS Lambda","React","D3.js","Python","Amazon QuickSight","GraphQL"]'::jsonb,
    false
),
(
    'AI Chatbot System',
    'AI Solutions',
    'Customer service chatbot with natural language understanding.',
    'https://images.unsplash.com/photo-1581090700227-1fbe50aef3d2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Company needed a scalable solution to handle customer queries automatically.',
    'Built an NLP-powered chatbot using Python, TensorFlow, and deployed on AWS.',
    'Reduced response time by 80%, improved customer satisfaction, handled 10k+ queries/day.',
    '["Python","TensorFlow","AWS","NLTK","Flask"]'::jsonb,
    true
),
(
    'Inventory Management System',
    'Custom Software',
    'A desktop/web app to manage inventory for medium-sized businesses.',
    'https://images.unsplash.com/photo-1581091012184-9174b1b08df6?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    'Clients struggled with manual tracking of stock, leading to errors and losses.',
    'Developed a web app using Laravel, MySQL, and Vue.js with barcode scanning support.',
    'Reduced stock errors by 90%, improved reporting efficiency, and saved 15 hours/week per employee.',
    '["Laravel","Vue.js","MySQL","JavaScript","Bootstrap"]'::jsonb,
    true
);
