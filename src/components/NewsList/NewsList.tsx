import { SimpleCell } from '@vkontakte/vkui';
import { useState } from 'react';
import { News } from '../../types';
import { useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

const NewsList = ({ itemList }: { itemList: News[] }) => {
  const routeNavigator = useRouteNavigator();
  const [items] = useState<News[]>(itemList);

  return (
    <>
      {items.map((item, i) => (
        <SimpleCell
          key={item.id}
          expandable="auto"
          before={i + 1}
          after={new Date(item.time * 1000).toLocaleString()}
          subtitle={`Score: ${item.score} / By: ${item.by}`}
          onClick={() => routeNavigator.push(`/news/${item.id}`)}
        >
          {item.title}
        </SimpleCell >
      ))}
    </>
  );
};

export default NewsList;
