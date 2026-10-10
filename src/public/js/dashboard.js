document.addEventListener('DOMContentLoaded', () => {
  // Biểu đồ Doanh thu (Revenue Chart)
  const revenueCtx = document.getElementById('revenueChart')?.getContext('2d');
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: 'line',
      data: {
        labels: [
          'T1',
          'T2',
          'T3',
          'T4',
          'T5',
          'T6',
          'T7',
          'T8',
          'T9',
          'T10',
          'T11',
          'T12',
        ],
        datasets: [
          {
            label: 'Doanh thu (triệu ₫)',
            data: [65, 59, 80, 81, 56, 55, 40, 95, 110, 120, 105, 128],
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  }

  // Biểu đồ Tỷ lệ Danh mục (Category Chart)
  const categoryCtx = document
    .getElementById('categoryChart')
    ?.getContext('2d');
  if (categoryCtx) {
    new Chart(categoryCtx, {
      type: 'doughnut',
      data: {
        labels: ['Thời trang', 'Giày dép', 'Phụ kiện', 'Khác'],
        datasets: [
          {
            data: [45, 25, 20, 10],
            backgroundColor: ['#2563eb', '#10b981', '#f59e0b', '#64748b'],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'bottom' },
        },
      },
    });
  }
});
