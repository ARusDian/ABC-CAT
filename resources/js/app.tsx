import './bootstrap';
import '../css/app.css';

import React from 'react';
import { render } from 'react-dom';
import { createInertiaApp } from '@inertiajs/inertia-react';
import { InertiaProgress } from '@inertiajs/progress';
import { RouteContext } from '@/Hooks/useRoute';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { ThemeProvider } from '@mui/material';
import { theme } from './muiTheme';
import { ConfirmProvider } from 'material-ui-confirm';

const appName =
  window.document.getElementsByTagName('title')[0]?.innerText || 'Laravel';

createInertiaApp({
  title: title => `${title} - ${appName}`,
  resolve: name =>
    resolvePageComponent(
      `./Pages/${name}.tsx`,
      import.meta.glob('./Pages/**/*.tsx'),
    ),
  setup({ el, App, props }) {
    return render(
      <ThemeProvider theme={theme}>
        <ConfirmProvider>
          <RouteContext.Provider value={(window as any).route}>
            <App {...props} />
          </RouteContext.Provider>
        </ConfirmProvider>
      </ThemeProvider>,
      el,
    );
  },
});

InertiaProgress.init({ color: '#4B5563' });
