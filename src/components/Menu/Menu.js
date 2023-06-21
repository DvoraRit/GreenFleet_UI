import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './Menu.scss';
import { _OpenTableName } from '../../recoil/atoms';
import { useRecoilState } from 'recoil';
//input:[{id, menuKey,name, text, icon,iconOnHover,open_sub_menu,anotherMenuKey, anotherMenuPosition, openAnotherMenuIcon, isOpenAnotherMenuIconRotate}]
function Menu({
	menuKey,
	icons,
	hoverBackgroundColor,
	backgroundColor,
	hoverTextColor = false,
	hasBottonLine = false,
	openAnotherMenuIconStyle,
	openMultipleMenus = false,
	OpenAnotherMenuIcon,
	functionOnClickRow,
	paddingRightSubMenu,
	anotherMenuClassName,
	selectedMenuTab,
	isSubMenu = false,
}) {
	const [items, setItems] = useState([]);
	const [mouseEnter, setMouseEnter] = useState(false);
	const [menuTextOpen, setMenuTextOpen] = useState([]);
	const [selectedTab, setSelectedTab] = useState(0);
	const [openTableName, setOpenTableName] = useRecoilState(_OpenTableName);
	const { t } = useTranslation();
	const getIcon = (index) =>{
		const indexInIcons = icons.findIndex(x=>x.index===index)
		return icons[indexInIcons].icon;
	}
	const getIconOnHover = (index) =>{
		const indexInIcons = icons.findIndex(x=>x.index===index)
		return icons[indexInIcons].iconOnHover;
	}
	
	useEffect(() => {
		let menusItems = localStorage.getItem('menus');
		if (menusItems !== 'undefined') {
			menusItems = JSON.parse(localStorage.getItem('menus'));
			setItems(
				menusItems?.rows
					?.filter((x) => x.menu_key === parseInt(menuKey))
					.sort((a, b) => a.menu_index - b.menu_index),
			);
		}
		//.filter(x=>x.menu_key===menuKey);
	}, []);

	useEffect(() => {
		
			setSelectedTab(openTableName);
		
	}, [openTableName]);

	const handleOpenAnotherMenu = (name) => {
		//setopenAnotherMenu(!openAnotherMenu)
		if (!openMultipleMenus) {
			if (menuTextOpen.length === 0) {
				setMenuTextOpen([name]);
			} else {
				setMenuTextOpen([]);
			}
		} else {
			if (menuTextOpen.includes(name)) {
				let indexToRemove = menuTextOpen.findIndex((x) => x === name);
				setMenuTextOpen(
					menuTextOpen
						.slice(0, indexToRemove)
						.concat(menuTextOpen.slice(indexToRemove + 1)),
				);
			} else {
				setMenuTextOpen([...menuTextOpen, name]);
			}
		}
	};
	const handleClickRow = (nameOfTable) => {
		functionOnClickRow(nameOfTable);

	}



	return (
		items &&
		items?.map((item, index) => {
			return (
				<>
					<div
						onClick={() =>
							item.open_sub_menu
								? handleOpenAnotherMenu(item.name)
								: handleClickRow(item.name)
						}
						onMouseEnter={() => setMouseEnter(item.id)}
						onMouseLeave={() => setMouseEnter(-1)}
						className='menu-row-style'
						style={{
							backgroundColor:
								mouseEnter === item.id || selectedTab===item.name ? hoverBackgroundColor : backgroundColor,
							paddingRight:
								paddingRightSubMenu && isSubMenu ? paddingRightSubMenu : 0,
						}}
						key={item.name}
					>
						<div className='icon-and-text-wrapper'>
							{icons && (
								<img
									src={
										getIcon(item.menu_index) && mouseEnter === item.id
											? getIconOnHover(item.menu_index) 
											:getIcon(item.menu_index)
									}
									alt='item.icon'
									className='icon-style-menu-row'
								/>
							)}
							<div
								className='menu-row-text-style'
								style={{
									color:
										mouseEnter === index ? hoverTextColor : 'rgba(0,0,0,0.87)',
								}}
							>
								{t(`menus.${item.name}`)}
							</div>
						</div>

						{item.open_sub_menu > 0 && (
							<OpenAnotherMenuIcon
								fontSize='small'
								style={openAnotherMenuIconStyle}
								sx={{
									transform:
										item.is_sub_menu_icon_rotation &&
										menuTextOpen.includes(item.name)
											? 'rotate(180deg)'
											: 'none',
								}}
								alt='openAnotherMenuIcon'
							/>
						)}
					</div>
					{menuTextOpen.includes(item.name) && (
						<div className={anotherMenuClassName ? anotherMenuClassName : ''}>
							<Menu
								//items = {items}
								menuKey={item.sub_menu_key}
								hoverBackgroundColor={hoverBackgroundColor}
								paddingRightSubMenu={paddingRightSubMenu}
								functionOnClickRow={functionOnClickRow}
								isSubMenu={true}
							/>
						</div>
					)}
				</>
			);
		})
	)
}

export default Menu;
