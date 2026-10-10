document.addEventListener('DOMContentLoaded', () => {
  // Render Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Dark Mode Toggle
  const toggleDarkBtn = document.getElementById('toggle-dark');
  toggleDarkBtn?.addEventListener('click', () => {
    document.documentElement.classList.toggle('dark');
  });

  // Sidebar Toggle
  const sidebar = document.getElementById('sidebar');
  const toggleSidebarBtn = document.getElementById('toggle-sidebar');
  toggleSidebarBtn?.addEventListener('click', () => {
    sidebar.classList.toggle('w-64');
    sidebar.classList.toggle('w-20');
    document
      .querySelectorAll('.sidebar-text')
      .forEach((el) => el.classList.toggle('hidden'));
  });
});

// Toast Utility Function
function showToast(message) {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  if (toast && toastMsg) {
    toastMsg.textContent = message;
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => {
      toast.classList.add('translate-y-20', 'opacity-0');
    }, 3000);
  }
}
