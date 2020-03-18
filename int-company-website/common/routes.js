const routes = require('next-routes')()

// Pages for everyone
routes
  .add('/', 'IndexPage')
  .add('/portfolio', 'PortfolioPage')
  .add('/blog', 'BlogHomePage')
  .add('/blog/:name', 'BlogPage')
// Pages for guest-only (not logged in user)
// routes
//   .add('/login', 'LoginPage')
//   .add('/signup', 'SignupPage')
//   .add('/reset-password', 'ResetPasswordPage')
//   .add('/reset-new-password', 'ResetNewPasswordPage')

// Pages for user-only

// routes.add('/my/settings', 'ProfileSettingsPage')

// Pages for admin-only
routes
  .add('/admin', 'admin/AdminIndexPage')
  .add('/admin/login', 'admin/AdminLoginPage')
  .add('/admin/setup', 'admin/AdminSetupPage')
  .add('/admin/my/settings', 'admin/AdminProfileSettingsPage')
  .add('/admin/users', 'admin/AdminListUserPage')
  .add('/admin/users/:id/edit', 'admin/AdminEditUserPage')
  .add('/admin/users/create', 'admin/AdminCreateUserPage')
  .add('/admin/roles', 'admin/AdminListRolePage')
  .add('/admin/configurations/email', 'admin/AdminEmailSettingsPage')

  .add('/admin/blogs', 'admin/blog/AdminListBlogPage')
  .add('/admin/blogtags', 'admin/blog/AdminListBlogTagPage')
  .add('/admin/blogs/create', 'admin/blog/AdminEditBlogPage')
  .add('/admin/blogs/:id/edit', 'admin/blog/AdminEditBlogPage')

module.exports = routes
