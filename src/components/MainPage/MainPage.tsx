import { CellButton, Div, Group, Header, PanelSpinner } from '@vkontakte/vkui';
import { Icon28SwitchOutline } from '@vkontakte/icons';
import { useEffect, useState } from 'react';
import NewsList from '../NewsList/NewsList';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { News } from '../../types';
import { changeItems } from '../../store/slice/hackerNews';

const MainPage = () => {
  const abortController = new AbortController();
  const [isLoading, setIsLoading] = useState(false)
  const [manualUpdate, setManualUpdate] = useState(false)
  const dispatch = useAppDispatch();
  const updateItems = (item: News[]) => dispatch(changeItems(item));
  const itemList = useAppSelector((state) => state.hackerNews.items);
  const baseUrlApi = useAppSelector((state) => state.hackerNews.baseUrlApi);

  const UpdateNews = (auto: boolean, controller: AbortController) => {
    const itemArray: News[] = [];
    if (!auto) {
      setManualUpdate(true);
      setIsLoading(true);
    }
    fetch(`${baseUrlApi}newstories.json`, { signal: controller.signal })
      .then(response => response.json())
      .then(JSON => JSON.slice(0, 100))
      .then(storyIds => {
        storyIds.forEach((storyId: number) => {
          fetch(`${baseUrlApi}item/${storyId}.json`, { signal: controller.signal })
            .then(response => response.json())
            .then(story => {
              itemArray.push(story);
            })
            .catch(error => {
              console.error('Error fetching story:', error);
            })
            .finally(() => {
              if (itemArray.length === 100) {
                updateItems(itemArray);
                if (!auto) {
                  setIsLoading(false);
                  setManualUpdate(false);
                }
              }
            });
        });
      })
      .catch(error => {
        console.error('Error fetching story ids:', error);
      });
  }

  useEffect(() => {
    UpdateNews(false, abortController);
    const interval = setInterval(() => {
      UpdateNews(true, abortController);
    }, 60000);

    return () => {
      abortController.abort();
      clearInterval(interval);
    };
  }, []);

  return (
    <>
      <Div>
        <Group header={<Header mode="primary" size="large">Новости</Header>}>
          <CellButton onClick={() => (UpdateNews(false, abortController))} centered before={
            <Icon28SwitchOutline />
          }>
            Обновить новости
          </CellButton>
          {(isLoading && manualUpdate) ? <PanelSpinner>Комментарии загружается, пожалуйста, подождите...</PanelSpinner> : <NewsList itemList={itemList} />}
        </Group >
      </Div >
    </>
  );
};

export default MainPage;
