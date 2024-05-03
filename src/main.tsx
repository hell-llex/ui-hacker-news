import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index';
import {
  AdaptivityProvider,
  ConfigProvider
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { RouterProvider, createBrowserRouter } from '@vkontakte/vk-mini-apps-router';
import bridge from '@vkontakte/vk-bridge';

bridge.send('VKWebAppInit');

const router = createBrowserRouter([
  {
    path: '/',
    panel: 'main_panel',
    view: 'main_view',
  },
  {
    path: '/news/:id',
    panel: 'news_panel',
    view: 'news_view',
  },
  {
    path: '*',
    panel: 'main_panel',
    view: 'main_view',
  },
]);

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <Provider store={store}>
        <RouterProvider router={router}>
          <App />
        </RouterProvider>
      </Provider>
    </AdaptivityProvider>
  </ConfigProvider>,
);
