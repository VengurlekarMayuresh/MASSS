import React, { useState } from 'react';
import { Search, Heart, Activity, Brain, Apple, Dumbbell, Sun, Moon, BookOpen, Clock, User } from 'lucide-react';
import './HealthyLiving.css';

const HealthyLiving = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Topics', icon: <BookOpen size={16} /> },
    { id: 'nutrition', name: 'Nutrition', icon: <Apple size={16} /> },
    { id: 'fitness', name: 'Fitness', icon: <Dumbbell size={16} /> },
    { id: 'mental-health', name: 'Mental Health', icon: <Brain size={16} /> },
    { id: 'sleep', name: 'Sleep', icon: <Moon size={16} /> },
    { id: 'prevention', name: 'Disease Prevention', icon: <Heart size={16} /> }
  ];

  const articles = [
    {
      id: 1,
      title: '10 Essential Nutrients for a Healthy Heart',
      category: 'nutrition',
      excerpt: 'Discover the key nutrients that can help maintain cardiovascular health and reduce the risk of heart disease.',
      author: 'Dr. Priya Sharma',
      readTime: '5 min read',
      publishDate: '2023-08-15',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=250&fit=crop',
      tags: ['Heart Health', 'Nutrition', 'Cardiovascular']
    },
    {
      id: 2,
      title: 'The Complete Guide to Morning Exercise Routines',
      category: 'fitness',
      excerpt: 'Start your day right with these effective morning workout routines that boost energy and metabolism.',
      author: 'Dr. Rajesh Kumar',
      readTime: '8 min read',
      publishDate: '2023-08-14',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=250&fit=crop',
      tags: ['Fitness', 'Morning Routine', 'Exercise']
    },
    {
      id: 3,
      title: 'Managing Stress: Techniques for Better Mental Health',
      category: 'mental-health',
      excerpt: 'Learn practical stress management techniques that can improve your mental well-being and overall quality of life.',
      author: 'Dr. Sunita Devi',
      readTime: '6 min read',
      publishDate: '2023-08-13',
      image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
      tags: ['Mental Health', 'Stress Management', 'Wellness']
    },
    {
      id: 4,
      title: 'Sleep Hygiene: Tips for Better Rest',
      category: 'sleep',
      excerpt: 'Improve your sleep quality with these evidence-based sleep hygiene practices and tips.',
      author: 'Dr. Amit Singh',
      readTime: '4 min read',
      publishDate: '2023-08-12',
      image: 'https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=400&h=250&fit=crop',
      tags: ['Sleep', 'Hygiene', 'Rest']
    },
    {
      id: 5,
      title: 'Preventing Diabetes: Lifestyle Changes That Matter',
      category: 'prevention',
      excerpt: 'Discover the lifestyle modifications that can significantly reduce your risk of developing type 2 diabetes.',
      author: 'Dr. Emily Johnson',
      readTime: '7 min read',
      publishDate: '2023-08-11',
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop',
      tags: ['Diabetes Prevention', 'Lifestyle', 'Health']
    },
    {
      id: 6,
      title: 'The Power of Hydration: Water and Your Health',
      category: 'nutrition',
      excerpt: 'Understand why proper hydration is crucial for your health and how to maintain optimal water intake.',
      author: 'Dr. Michael Brown',
      readTime: '5 min read',
      publishDate: '2023-08-10',
      image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=250&fit=crop',
      tags: ['Hydration', 'Water', 'Health']
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <div className="health-living-container">
      <div className="health-container">
        {/* Header */}
        <div className="health-page-header">
          <h1>Healthy Living Secrets</h1>
          <p>Discover tips, articles, and expert advice for a healthier lifestyle</p>
        </div>

        {/* Search and Categories */}
        <div className="health-search-categories-section">
          <div className="health-search-container">
            <div className="health-search-input-wrapper">
              <Search size={20} className="health-search-icon" />
              <input
                type="text"
                placeholder="Search for health topics, tips, or articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="health-search-input"
              />
            </div>
          </div>

          <div className="health-categories-container">
            {categories.map(category => (
              <button
                key={category.id}
                className={`health-category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Featured Article */}
        {filteredArticles.length > 0 && (
          <div className="health-featured-article">
            <div className="health-featured-content">
              <div className="health-featured-text">
                <span className="health-featured-badge">Featured</span>
                <h2>{filteredArticles[0].title}</h2>
                <p>{filteredArticles[0].excerpt}</p>
                <div className="health-article-meta">
                  <span className="author">
                    <User size={14} />
                    {filteredArticles[0].author}
                  </span>
                  <span className="read-time">
                    <Clock size={14} />
                    {filteredArticles[0].readTime}
                  </span>
                  <span className="publish-date">
                    {formatDate(filteredArticles[0].publishDate)}
                  </span>
                </div>
                <button className="health-btn health-btn-primary">Read Full Article</button>
              </div>
              <div className="health-featured-image">
                <img 
                  src={filteredArticles[0].image} 
                  alt={filteredArticles[0].title}
                />
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="health-articles-section">
          <div className="health-section-header">
            <h3>Latest Articles</h3>
            <p>Stay informed with our latest health and wellness content</p>
          </div>

          <div className="health-articles-grid">
            {filteredArticles.slice(1).map(article => (
              <article key={article.id} className="health-article-card">
                <div className="health-article-image">
                  <img src={article.image} alt={article.title} />
                  <div className="health-category-tag">{categories.find(c => c.id === article.category)?.name}</div>
                </div>
                
                <div className="health-article-content">
                  <h4 className="health-article-title">{article.title}</h4>
                  <p className="health-article-excerpt">{article.excerpt}</p>
                  
                  <div className="health-article-tags">
                    {article.tags.map(tag => (
                      <span key={tag} className="health-tag">{tag}</span>
                    ))}
                  </div>
                  
                  <div className="health-article-meta">
                    <span className="author">
                      <User size={14} />
                      {article.author}
                    </span>
                    <span className="read-time">
                      <Clock size={14} />
                      {article.readTime}
                    </span>
                  </div>
                  
                  <button className="health-btn health-btn-secondary">Read More</button>
                </div>
              </article>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="health-no-results">
              <p>No articles found matching your criteria.</p>
              <p>Try adjusting your search or category selection.</p>
            </div>
          )}
        </div>

        {/* Newsletter Signup */}
        <div className="health-newsletter-section">
          <div className="health-newsletter-content">
            <h3>Stay Updated with Health Tips</h3>
            <p>Get the latest health and wellness articles delivered to your inbox</p>
            <div className="health-newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
                className="health-newsletter-input"
              />
              <button className="health-btn health-btn-primary">Subscribe</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthyLiving;
