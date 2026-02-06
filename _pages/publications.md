---
layout: page
permalink: /publications/
title: publications
nav: true
nav_order: 2
---

<!-- _pages/publications.md -->

<div class="publications-wrapper">
  
  <!-- Floating Section Navigator (Left Side) -->
  <div class="section-nav">
    <div class="section-nav-item" data-section="publications">
      <span class="section-nav-number">01</span>
      <span class="section-nav-label">Publications</span>
    </div>
    <div class="section-nav-item" data-section="talks">
      <span class="section-nav-number">02</span>
      <span class="section-nav-label">Talks</span>
    </div>
  </div>

  <!-- Main Content Area -->
  <div class="publications-main">
    
    <!-- Subtle Controls Sidebar (Right Side) -->
    <div class="controls-sidebar">
      <div class="controls-group">
        <div class="controls-label">Sort by</div>
        <div class="sort-options">
          <button class="sort-btn active" data-sort="time">Time</button>
          <button class="sort-btn" data-sort="type">Type</button>
          <button class="sort-btn" data-sort="topic">Topic</button>
        </div>
      </div>
    </div>

    <!-- Publications Section -->
    <div id="publications-section" class="content-section">
      <h2 class="section-heading">Publications</h2>
      <div id="publications-container">
        {% bibliography %}
      </div>
    </div>

    <!-- Talks Section -->
    <div id="talks-section" class="content-section" style="margin-top: 4rem;">
      <h2 class="section-heading">Talks</h2>
      <div id="talks-container">
        {% bibliography --file talks %}
      </div>
    </div>

  </div>
</div>

<script>
document.addEventListener("DOMContentLoaded", function() {
  // Publication type definitions - dynamically loaded from YAML
  // Store both display name and short name for sorting
  const pubTypes = {
    {% for pub_type in site.data.pub_types %}
    "{{ pub_type[0] }}": {
      display: "{{ pub_type[1].display }}",
      color: "{{ pub_type[1].color }}",
      short: "{{ pub_type[1].short }}"
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  // Talk type definitions - dynamically loaded from YAML
  // Store both display name and short name for sorting
  const talkTypes = {
    {% for talk_type in site.data.talk_types %}
    "{{ talk_type[0] }}": {
      display: "{{ talk_type[1].display }}",
      short: "{{ talk_type[1].short }}"
    }{% unless forloop.last %},{% endunless %}
    {% endfor %}
  };

  // Get publications and talks from their respective containers
  const publications = Array.from(document.querySelectorAll('#publications-container .bibliography > li'));
  const talks = Array.from(document.querySelectorAll('#talks-container .bibliography > li'));

  // Extract unique themes from publications (needed for topic view)
  const abbrSet = new Set();
  publications.forEach(pub => {
    const abbrElements = pub.querySelectorAll('.abbr abbr[data-abbr-tag]');
    abbrElements.forEach(abbrEl => {
      const abbr = abbrEl.getAttribute('data-abbr-tag');
      if (abbr) abbrSet.add(abbr);
    });
  });

  // Section navigation
  const sectionNavItems = document.querySelectorAll('.section-nav-item');
  sectionNavItems.forEach(item => {
    item.addEventListener('click', function() {
      const section = this.getAttribute('data-section');
      const targetSection = document.getElementById(section + '-section');
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update active state
        sectionNavItems.forEach(nav => nav.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Update active section on scroll
  function updateActiveSection() {
    const sections = [
      { id: 'publications-section', nav: document.querySelector('[data-section="publications"]') },
      { id: 'talks-section', nav: document.querySelector('[data-section="talks"]') }
    ];
    
    sections.forEach(({ id, nav }) => {
      const section = document.getElementById(id);
      if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 100 && rect.bottom >= 100) {
          sectionNavItems.forEach(item => item.classList.remove('active'));
          if (nav) nav.classList.add('active');
        }
      }
    });
  }

  window.addEventListener('scroll', updateActiveSection);
  updateActiveSection(); // Initial check

  // Sort functionality
  let currentSort = 'time';
  const sortButtons = document.querySelectorAll('.sort-btn');
  
  sortButtons.forEach(button => {
    button.addEventListener('click', function() {
      sortButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      currentSort = this.getAttribute('data-sort');
      reorganizeView();
    });
  });

  // Reorganize view based on sort
  function reorganizeView() {
    if (currentSort === 'time') {
      showTimeView();
    } else if (currentSort === 'type') {
      showTypeView();
    } else if (currentSort === 'topic') {
      showTopicView();
    }
    organizeTalks();
  }

  // Show time view (default - by year)
  function showTimeView() {
    const container = document.getElementById('publications-container');
    
    if (!window.originalPublicationsHTML) {
      window.originalPublicationsHTML = container.innerHTML;
    } else {
      container.innerHTML = window.originalPublicationsHTML;
      // Re-initialize abstract toggle after restoring HTML
      setTimeout(() => {
        initializeAbstractToggle();
      }, 50);
    }
    
    const restoredPubs = Array.from(document.querySelectorAll('#publications-container .bibliography > li'));
    restoredPubs.forEach(pub => pub.classList.remove('unloaded'));
    document.querySelectorAll('#publications-container h2.bibliography, #publications-container ol.bibliography').forEach(el => {
      el.classList.remove('unloaded');
    });
  }

  // Show type view
  function showTypeView() {
    const container = document.getElementById('publications-container');
    
    if (!window.originalPublicationsHTML) {
      window.originalPublicationsHTML = container.innerHTML;
    }
    
    const allPubs = Array.from(document.querySelectorAll('#publications-container .bibliography > li'));
    const typeGroups = {};
    
    allPubs.forEach(pub => {
      // The data attributes are on the inner div, not the li
      const pubDiv = pub.querySelector('div[data-pub-type]');
      if (pubDiv) {
        const pubType = pubDiv.getAttribute('data-pub-type');
        if (pubType && pubTypes[pubType]) {
          // Use the original key as the group key (same as talks)
          if (!typeGroups[pubType]) {
            typeGroups[pubType] = [];
          }
          typeGroups[pubType].push(pub.cloneNode(true));
        }
      }
    });
    
    Object.keys(typeGroups).forEach(type => {
      typeGroups[type].sort((a, b) => {
        // Get year from the inner div
        const yearDivA = a.querySelector('div[data-year]');
        const yearDivB = b.querySelector('div[data-year]');
        const yearA = yearDivA ? parseInt(yearDivA.getAttribute('data-year')) || 0 : 0;
        const yearB = yearDivB ? parseInt(yearDivB.getAttribute('data-year')) || 0 : 0;
        return yearB - yearA;
      });
    });
    
    let newHTML = '';
    // Iterate through pubTypes in YAML order (same pattern as talks)
    Object.keys(pubTypes).forEach(typeKey => {
      if (typeGroups[typeKey] && typeGroups[typeKey].length > 0) {
        const displayName = pubTypes[typeKey].display;
        newHTML += `<h2 class="bibliography type-heading">${displayName}</h2>`;
        newHTML += '<ol class="bibliography">';
        typeGroups[typeKey].forEach(pub => {
          newHTML += pub.outerHTML;
        });
        newHTML += '</ol>';
      }
    });
    
    container.innerHTML = newHTML;
    // Re-initialize abstract toggle after reorganizing
    setTimeout(() => {
      initializeAbstractToggle();
    }, 50);
  }

  // Show topic view (grouped by theme)
  function showTopicView() {
    const container = document.getElementById('publications-container');
    
    if (!window.originalPublicationsHTML) {
      window.originalPublicationsHTML = container.innerHTML;
    }
    
    const allPubs = Array.from(document.querySelectorAll('#publications-container .bibliography > li'));
    const topicGroups = {};
    const allTopicsSet = new Set();
    
    allPubs.forEach(pub => {
      const abbrElements = pub.querySelectorAll('.abbr abbr[data-abbr-tag]');
      const topics = [];
      abbrElements.forEach(abbrEl => {
        const topic = abbrEl.getAttribute('data-abbr-tag');
        if (topic) {
          topics.push(topic);
          allTopicsSet.add(topic);
        }
      });
      
      // Use first topic only for sorting (or 'Other' if no topics)
      const firstTopic = topics.length > 0 ? topics[0] : 'Other';
      if (firstTopic === 'Other') {
        allTopicsSet.add('Other');
      }
      
      if (!topicGroups[firstTopic]) {
        topicGroups[firstTopic] = [];
      }
      topicGroups[firstTopic].push(pub.cloneNode(true));
    });
    
    Object.keys(topicGroups).forEach(topic => {
      topicGroups[topic].sort((a, b) => {
        // Get year from the inner div
        const yearDivA = a.querySelector('div[data-year]');
        const yearDivB = b.querySelector('div[data-year]');
        const yearA = yearDivA ? parseInt(yearDivA.getAttribute('data-year')) || 0 : 0;
        const yearB = yearDivB ? parseInt(yearDivB.getAttribute('data-year')) || 0 : 0;
        return yearB - yearA;
      });
    });
    
    let newHTML = '';
    // Sort topics and display them
    Array.from(allTopicsSet).sort().forEach(topic => {
      if (topicGroups[topic] && topicGroups[topic].length > 0) {
        newHTML += `<h2 class="bibliography type-heading">${topic}</h2>`;
        newHTML += '<ol class="bibliography">';
        topicGroups[topic].forEach(pub => {
          newHTML += pub.outerHTML;
        });
        newHTML += '</ol>';
      }
    });
    
    container.innerHTML = newHTML;
    // Re-initialize abstract toggle after reorganizing
    setTimeout(() => {
      initializeAbstractToggle();
    }, 50);
  }

  // Initialize abstract toggle functionality
  function initializeAbstractToggle() {
    // Remove any existing event listeners by cloning and replacing
    document.querySelectorAll('a.abstract.btn').forEach(btn => {
      // Remove old listeners by replacing the element
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      
      // Add click handler
      newBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const entry = this.closest('li');
        if (!entry) return;
        
        const abstractDiv = entry.querySelector('.abstract.hidden');
        if (abstractDiv) {
          abstractDiv.classList.toggle('open');
        }
        // Close other open abstracts/awards/bibtex in same entry
        entry.querySelectorAll('.award.hidden.open, .bibtex.hidden.open').forEach(el => {
          el.classList.remove('open');
        });
      });
    });
  }


  // Organize talks section
  function organizeTalks() {
    const talksContainer = document.getElementById('talks-container');
    
    if (talks.length === 0) {
      document.getElementById('talks-section').style.display = 'none';
      return;
    }
    
    document.getElementById('talks-section').style.display = 'block';
    
    if (!window.originalTalksHTML) {
      window.originalTalksHTML = talksContainer.innerHTML;
    }
    
    if (currentSort === 'time') {
      talksContainer.innerHTML = window.originalTalksHTML;
    } else if (currentSort === 'topic') {
      // Topic sorting for talks (similar to publications)
      const talkTopicGroups = {};
      const allTalkTopicsSet = new Set();
      
      talks.forEach(talk => {
        const abbrElements = talk.querySelectorAll('.abbr abbr[data-abbr-tag]');
        const topics = [];
        abbrElements.forEach(abbrEl => {
          const topic = abbrEl.getAttribute('data-abbr-tag');
          if (topic) {
            topics.push(topic);
            allTalkTopicsSet.add(topic);
          }
        });
        
        // Use first topic only for sorting (or 'Other' if no topics)
        const firstTopic = topics.length > 0 ? topics[0] : 'Other';
        if (firstTopic === 'Other') {
          allTalkTopicsSet.add('Other');
        }
        
        if (!talkTopicGroups[firstTopic]) {
          talkTopicGroups[firstTopic] = [];
        }
        talkTopicGroups[firstTopic].push(talk.cloneNode(true));
      });
      
      Object.keys(talkTopicGroups).forEach(topic => {
        talkTopicGroups[topic].sort((a, b) => {
          // Get year from the inner div
          const yearDivA = a.querySelector('div[data-year]');
          const yearDivB = b.querySelector('div[data-year]');
          const yearA = yearDivA ? parseInt(yearDivA.getAttribute('data-year')) || 0 : 0;
          const yearB = yearDivB ? parseInt(yearDivB.getAttribute('data-year')) || 0 : 0;
          return yearB - yearA;
        });
      });
      
      let talksHTML = '';
      // Sort topics and display them
      Array.from(allTalkTopicsSet).sort().forEach(topic => {
        if (talkTopicGroups[topic] && talkTopicGroups[topic].length > 0) {
          talksHTML += `<h2 class="bibliography type-heading">${topic}</h2>`;
          talksHTML += '<ol class="bibliography talks-list">';
          talkTopicGroups[topic].forEach(talk => {
            talksHTML += talk.outerHTML;
          });
          talksHTML += '</ol>';
        }
      });
      
      talksContainer.innerHTML = talksHTML;
    } else if (currentSort === 'type') {
      const talkGroups = {};
      talks.forEach(talk => {
        // The data attributes are on the inner div, not the li
        const talkDiv = talk.querySelector('div[data-talk-type]');
        if (talkDiv) {
          const talkType = talkDiv.getAttribute('data-talk-type');
          if (talkType && talkTypes[talkType]) {
            // Use the original key as the group key
            if (!talkGroups[talkType]) {
              talkGroups[talkType] = [];
            }
            talkGroups[talkType].push(talk.cloneNode(true));
          }
        }
      });
      
      Object.keys(talkGroups).forEach(group => {
        talkGroups[group].sort((a, b) => {
          // Get year from the inner div
          const yearDivA = a.querySelector('div[data-year]');
          const yearDivB = b.querySelector('div[data-year]');
          const yearA = yearDivA ? parseInt(yearDivA.getAttribute('data-year')) || 0 : 0;
          const yearB = yearDivB ? parseInt(yearDivB.getAttribute('data-year')) || 0 : 0;
          return yearB - yearA;
        });
      });
      
      let talksHTML = '';
      // Iterate through talkTypes in YAML order
      Object.keys(talkTypes).forEach(talkTypeKey => {
        if (talkGroups[talkTypeKey] && talkGroups[talkTypeKey].length > 0) {
          const groupName = talkTypes[talkTypeKey].display;
          talksHTML += `<h2 class="bibliography type-heading">${groupName}</h2>`;
          talksHTML += '<ol class="bibliography talks-list">';
          talkGroups[talkTypeKey].forEach(talk => {
            talksHTML += talk.outerHTML;
          });
          talksHTML += '</ol>';
        }
      });
      
      talksContainer.innerHTML = talksHTML;
    }
    // Re-initialize abstract toggle for talks
    setTimeout(() => {
      initializeAbstractToggle();
    }, 50);
  }

  // Initialize
  organizeTalks();
  
  // Initialize abstract toggle - with delay to ensure DOM is ready
  setTimeout(() => {
    initializeAbstractToggle();
  }, 100);
  
  // Also re-initialize after any DOM changes
  const originalReorganizeView = reorganizeView;
  reorganizeView = function() {
    originalReorganizeView();
    setTimeout(() => {
      initializeAbstractToggle();
    }, 100);
  };
});
</script>

<style>
.publications-wrapper {
  position: relative;
  display: flex;
  max-width: 100%; /* Use full width */
  margin: 0 auto;
  padding: 0 2rem; /* Reduced padding */
  width: 100%;
}

/* Floating Section Navigator (Left) */
.section-nav {
  position: fixed;
  left: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  font-size: 0.75rem;
  color: #888;
}

.section-nav-item:hover {
  opacity: 0.7;
}

.section-nav-item.active {
  opacity: 1;
  color: #666;
}

.section-nav-number {
  font-weight: 500;
  min-width: 1.5rem;
  font-size: 0.7rem;
}

.section-nav-label {
  font-weight: 400;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Main Content */
.publications-main {
  flex: 1;
  position: relative;
  padding-left: 3rem; /* Space for left nav */
  padding-right: 5rem; /* Space for controls sidebar */
  max-width: 100%; /* Use full available width */
  margin: 0;
  width: 100%;
}

/* Subtle Controls Sidebar (Right) */
.controls-sidebar {
  position: fixed;
  right: 2rem;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
  background: transparent;
  padding: 1rem 0;
  width: 120px; /* Fixed width to minimize space */
}

.controls-group {
  margin-bottom: 2rem;
}

.controls-label {
  font-size: 0.7rem;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.75rem;
  font-weight: 400;
}

.sort-options {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.sort-btn {
  background: transparent;
  border: 1px solid #ddd;
  color: #999;
  padding: 0.4rem 0.8rem;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.75rem;
  text-align: left;
  font-weight: 300;
}

.sort-btn:hover {
  border-color: #bbb;
  color: #777;
  background: #f9f9f9;
}

.sort-btn.active {
  border-color: #999;
  color: #666;
  background: #f5f5f5;
  font-weight: 400;
}

/* Content Sections */
.content-section {
  position: relative;
}

.section-heading {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--global-divider-color);
}

.pub-type-badge,
.talk-type-badge {
  display: inline-block;
}

/* Unified styling for all buttons and tags - slick, consistent look */
.pub-type-badge .badge,
.talk-type-badge .badge,
.publications-main .abbr .badge,
.publications-main .abbr abbr.badge,
.publications-main .links a.btn {
  font-size: 0.7rem !important; /* Smaller font - force with !important */
  padding: 0.25rem 0.4rem !important; /* Smaller padding - force with !important */
  font-weight: 400 !important;
  border-radius: 8px !important; /* Smooth rounded edges */
  line-height: 1.2 !important; /* Consistent height - force with !important */
  display: inline-block;
  box-sizing: border-box !important; /* Include padding in height calculation */
  height: 1.3rem !important; /* Force exact same height for all */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15), 0 1px 2px rgba(0, 0, 0, 0.1) !important; /* More prominent shadow for slick look */
  transition: all 0.2s ease;
  text-decoration: none;
  font-family: inherit !important; /* Same font family */
  vertical-align: middle !important; /* Align all elements on same baseline */
  text-transform: none !important; /* Ensure no uppercase transformation */
  letter-spacing: 0.02em !important; /* Slight letter spacing */
}

.pub-type-badge .badge,
.talk-type-badge .badge {
  color: white;
  opacity: 0.90 !important; /* Semi-transparent background */
}

/* Abbr badges (research theme tags) - more transparent than type badges */
.publications-main .abbr .badge,
.publications-main .abbr abbr.badge {
  opacity: 0.5 !important; /* More transparent than type badges */
}

/* Theme tags (abbr badges) - consistent styling */
.publications-main .abbr .badge,
.publications-main .abbr abbr.badge {
  color: white !important; /* Ensure white text is visible */
}

/* Ensure badges with custom background colors have white text */
.publications-main .abbr .badge[style*="background-color"],
.publications-main .abbr abbr.badge[style*="background-color"] {
  color: white !important;
}

.publications-main .abbr .badge a,
.publications-main .abbr abbr.badge a {
  color: white !important;
  text-decoration: none;
}

.publications-main .abbr .badge a:hover,
.publications-main .abbr abbr.badge a:hover {
  color: white !important;
  opacity: 0.9;
}

/* More authors functionality removed - all authors always shown */

.bibliography > li.unloaded,
h2.bibliography.unloaded,
ol.unloaded {
  display: none;
}

.type-heading {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--global-theme-color);
}

.talk-year-heading {
  font-size: 1.5rem;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: var(--global-theme-color);
  font-weight: 600;
}

/* Talk group headings now use type-heading class to match publications */

.talks-list {
  margin-bottom: 2rem;
}

/* Use original al-folio year headings style */
.publications-main h2.bibliography {
  color: #989898;   /* var(--global-divider-color); */
  border-top: 1px solid var(--global-divider-color);
  padding-top: 1rem;
  margin-top: 2rem;
  text-align: right; /* Original al-folio style - right aligned */
  font-size: 1.5rem; /* Larger font size for year headings */
  font-weight: inherit;
}

/* Make entries wider and better styled */
.publications-main .bibliography {
  max-width: 100%;
  padding-left: 0;
  width: 100%;
}

.publications-main .bibliography > li {
  margin-bottom: 1.5rem; /* Reduced from 2.5rem */
  padding-left: 0;
  padding-right: 0;
  list-style: none;
  width: 100%;
  max-width: 100%;
}

.publications-main .bibliography > li > .row {
  width: 100%;
  max-width: 100%;
  margin: 0;
}

.publications-main .bibliography > li > .row > .col-sm-12 {
  padding: 0;
  width: 100%;
  max-width: 100%;
}

/* Ensure all content inside entries uses full width */
.publications-main .bibliography > li .title,
.publications-main .bibliography > li .author,
.publications-main .bibliography > li .periodical {
  max-width: 100%;
  width: 100%;
  margin-bottom: 0.3rem; /* Reduced spacing */
}

.publications-main .bibliography > li .title {
  margin-bottom: 0.4rem;
}

.publications-main .bibliography > li .author {
  margin-bottom: 0.3rem;
}

.publications-main .bibliography > li .periodical {
  margin-bottom: 0.4rem;
}

/* Links, type badge, and theme tags in one row */
.publications-main .bibliography > li .links-and-badges {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  width: 100%;
  max-width: 100%;
}

.publications-main .bibliography > li .links {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
}

.publications-main .bibliography > li .pub-type-badge {
  display: inline-block;
  margin: 0;
}

.publications-main .bibliography > li .abbr {
  display: inline-flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin: 0;
  max-width: 100%;
}

/* Title - bold */
.publications-main .bibliography > li .title {
  font-weight: 500 !important; /* Bold title */
  font-size: 1.05rem;
  margin-bottom: 0.4rem;
}

/* Author name - bold when it's the user */
.publications-main .bibliography > li .author strong {
  font-weight: 400 !important; /* Bold author name */
  font-style: normal;
}

/* Note text - blue links for featured items */
.publications-main .bibliography > li .note-text {
  color: #0076df !important; /* Blue color for notes */
  font-size: 0.9rem;
  margin-top: 0.3rem;
  margin-bottom: 0.5rem;
}

.publications-main .bibliography > li .note-text a {
  color: #0076df !important;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s ease;
}

.publications-main .bibliography > li .note-text a:hover {
  border-bottom-color: #0076df;
}

/* Button styling - consistent with tags, cleaner look like reference */
.publications-main .links a.btn {
  border: 1px solid #ddd !important;
  color: #666 !important;
  background: #f5f5f5 !important;
  cursor: pointer;
  margin: 0;
  /* Height, padding, font-size already set in unified styling above with !important */
}

.publications-main .links a.btn:hover {
  border-color: #999;
  color: #333;
  background: #e8e8e8;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Subtle shadow on hover */
}

/* Abstract button - visible and clickable, same height as tags */
.publications-main .links a.abstract.btn,
.publications-main a.abstract.btn {
  display: inline-block !important;
  visibility: visible !important;
  opacity: 1 !important;
  cursor: pointer !important;
  pointer-events: auto !important;
  height: 1.3rem !important; /* Match tags exactly */
  line-height: 1.2 !important; /* Match tags exactly */
  padding: 0.25rem 0.4rem !important; /* Match tags exactly */
  text-transform: none !important; /* Ensure "Abstract" not "ABSTRACT" */
}

/* PDF button - cleaner grey background, same height as tags */
.publications-main .links a.btn[href*="pdf"],
.publications-main .links a.btn[href*="PDF"] {
  background-color: #f5f5f5 !important;
  border-color: #ddd !important;
  color: #666 !important;
  height: 1.3rem !important; /* Match tags exactly */
  line-height: 1.2 !important; /* Match tags exactly */
  padding: 0.25rem 0.4rem !important; /* Match tags exactly */
  text-transform: none !important;
}

.publications-main .links a.btn[href*="pdf"]:hover,
.publications-main .links a.btn[href*="PDF"]:hover {
  background-color: #e8e8e8 !important;
  border-color: #999 !important;
  color: #333 !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15); /* Subtle shadow on hover */
}

/* Ensure abstract is hidden by default */
.publications-main .abstract.hidden {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  transition: max-height 0.3s ease, opacity 0.3s ease, padding 0.3s ease;
  padding: 0;
  margin: 0;
}

.publications-main .abstract.hidden.open {
  max-height: 2000px;
  opacity: 1;
  margin-top: 1rem;
  padding: 1rem;
  background: #f9f9f9;
  border-left: 3px solid #999;
  font-size: 0.9rem;
  line-height: 1.6;
  display: block;
}

.publications-main .abstract.hidden p {
  margin: 0;
  padding: 0;
}

/* Responsive adjustments */
@media (max-width: 1200px) {
  .publications-main {
    padding-left: 0.5rem;
    padding-right: 0;
  }
  
  .controls-sidebar {
    position: static;
    transform: none;
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    padding: 1rem;
    background: #fafafa;
    border-radius: 4px;
    width: auto;
  }
  
  .sort-options {
    flex-direction: row;
    flex-wrap: wrap;
  }
  
  .section-nav {
    display: none;
  }
}

@media (max-width: 768px) {
  .publications-wrapper {
    padding: 0 0.5rem;
  }
  
  .publications-main {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
  
  .controls-sidebar {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>
