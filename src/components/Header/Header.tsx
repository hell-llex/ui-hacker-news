import { PanelHeader, PanelHeaderBack } from '@vkontakte/vkui';
import { useActiveVkuiLocation, useRouteNavigator } from '@vkontakte/vk-mini-apps-router';

const Header = () => {
	const routeNavigator = useRouteNavigator();
	const { view: activeView } = useActiveVkuiLocation();

	return (
		<>
			<PanelHeader
				before={activeView === 'news_view' &&
					<PanelHeaderBack onClick={() => routeNavigator.back()} />
				}
			>
				Hacker News App
			</PanelHeader>
		</>
	);
};

export default Header;
