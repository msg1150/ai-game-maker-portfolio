const header = document.querySelector('.site-header');
if (header) {
  const updateHeaderHeight = () => {
    document.documentElement.style.setProperty('--header-height', `${header.getBoundingClientRect().height}px`);
  };
  updateHeaderHeight();
  if ('ResizeObserver' in window) {
    new ResizeObserver(updateHeaderHeight).observe(header);
  } else {
    window.addEventListener('resize', updateHeaderHeight);
  }
}

for (const button of document.querySelectorAll('[data-copy]')) {
  const prompt = button.closest('.prompt-body');
  const code = prompt.querySelector('code');
  const status = prompt.querySelector('[role="status"]');

  if (!navigator.clipboard) continue;
  button.hidden = false;
  button.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(code.textContent);
      status.textContent = '복사했습니다.';
    } catch {
      status.textContent = '텍스트를 선택해 복사해 주세요.';
    }
  });
}
