const express = require('express');
const morgan = require('morgan');
const { engine } = require('express-handlebars');
const Handlebars = require('handlebars');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
const sortMiddleware = require('./app/middlewares/sort.middleware');
const path = require('path');

require('dotenv').config();

const app = express();
const port = 3000;

const route = require('./routes/');

// Kết nối database
connectDB();

// Middleware
app.use(morgan('combined'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Middleware sort: phải nằm trước router
app.use(sortMiddleware);

// Handlebars
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    helpers: {
      sortable: (field, sort) => {
        const isCurrentColumn = field === sort.column;
        const isDesc = isCurrentColumn && sort.type === 'desc';
        const isAsc = isCurrentColumn && sort.type === 'asc';

        const nextType = isDesc ? 'asc' : 'desc';

        const html = `
    <a href="?_sort&column=${encodeURIComponent(field)}&type=${nextType}"
       class="inline-flex items-center gap-2 hover:text-brand-600 cursor-pointer"
       aria-label="Sắp xếp theo ${field}">
      <span>${
        {
          name: 'Sản phẩm',
          createdAt: 'Ngày tạo',
          price: 'Giá bán',
          stock: 'Tồn kho',
        }[field] || field
      }</span>

      <span class="inline-flex flex-col">
        <i data-lucide="chevron-up"
           class="w-3 h-3 ${isAsc ? 'text-brand-600' : 'text-gray-400'}"></i>
        <i data-lucide="chevron-down"
           class="w-3 h-3 ${isDesc ? 'text-brand-600' : 'text-gray-400'}"></i>
      </span>
    </a>
  `;

        return new Handlebars.SafeString(html);
      },

      formatCurrency: (value) =>
        new Intl.NumberFormat('vi-VN', {
          style: 'currency',
          currency: 'VND',
        }).format(value || 0),

      gt: (a, b) => a > b,
      eq: (a, b) => a === b,
      ne: (a, b) => a !== b,
      lt: (a, b) => a < b,
      lte: (a, b) => a <= b,
      gte: (a, b) => a >= b,
      and: (a, b) => a && b,
      or: (a, b) => a || b,
      not: (value) => !value,
      sum: (a, b) => a + b,

      formatDate: (dateString) => {
        if (!dateString) return 'Chưa cập nhật';

        return new Intl.DateTimeFormat('vi-VN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }).format(new Date(dateString));
      },
    },
  }),
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources', 'views'));

// Routes
route(app);

// Server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
