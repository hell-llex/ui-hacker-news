import '@vkontakte/vkui/dist/vkui.css';
import MainPage from './components/MainPage/MainPage';
import { useActiveVkuiLocation } from '@vkontakte/vk-mini-apps-router';
import { Root, View, Panel, AppRoot } from '@vkontakte/vkui';
import Header from './components/Header/Header';
import NewsPage from './components/NewsPage/NewsPage';

function App() {
  const { view: activeView, panel: activePanel } = useActiveVkuiLocation();

  return (
    <>
      <AppRoot>
        <Header />
        <Root activeView={activeView!}>
          <View nav="main_view" activePanel={activePanel!}>
            <Panel nav="main_panel">
              <MainPage />
            </Panel>
          </View>
          <View nav="news_view" activePanel={activePanel!}>
            <Panel nav="news_panel">
              <NewsPage />
            </Panel>
          </View>
        </Root>
      </AppRoot >
    </>
  );
}

export default App;
