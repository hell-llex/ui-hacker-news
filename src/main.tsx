import ReactDOM from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { Provider } from 'react-redux';
import { store } from './store/index';
import {
  AdaptivityProvider,
  ConfigProvider
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <ConfigProvider>
//     <AdaptivityProvider>
//       <Provider store={store}>
//         <App />
//       </Provider>
//     </AdaptivityProvider>
//   </ConfigProvider>,
// );

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <ConfigProvider>
    <AdaptivityProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </AdaptivityProvider>
  </ConfigProvider>,
);
