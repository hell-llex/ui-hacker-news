import './App.scss';
import {
  AppRoot,
  SplitLayout,
  SplitCol,
  View,
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  usePlatform,
} from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import * as React from 'react';

function App() {
  const platform = usePlatform();

  return (
    <>
      <AppRoot>
        <SplitLayout header={platform !== 'vkcom' && <PanelHeader delimiter="none" />}>
          <SplitCol autoSpaced>
            <View activePanel="main">
              <Panel id="main">
                <PanelHeader>VKUI</PanelHeader>
                <Group header={<Header mode="secondary">Items</Header>}>
                  <SimpleCell>Hello</SimpleCell>
                  <SimpleCell>World</SimpleCell>
                </Group>
              </Panel>
            </View>
          </SplitCol>
        </SplitLayout>
      </AppRoot>
    </>
  );
}

export default App;
