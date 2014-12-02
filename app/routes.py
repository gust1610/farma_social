from ferris.core import routing, plugins

# Routes all App handlers
routing.auto_route()

# Default root route
routing.default_root()
routing.redirect('/mayorista', to='/mayorista/index')
#routing.redirect('/', to='/mayorista/index')

# Plugins
#plugins.enable('settings')
#plugins.enable('oauth_manager')
plugins.enable('custom_auth')
plugins.enable('recaptcha')