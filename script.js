// Animate skill bars when in view
  const skills = document.querySelectorAll('.skill-fill');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.style.width = entry.target.style.width; // triggers transition
      }
    });
  }, { threshold: 0.5 });

  skills.forEach(skill => observer.observe(skill));