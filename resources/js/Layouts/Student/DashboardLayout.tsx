import React, { PropsWithChildren } from 'react';
import { Head, router, usePage } from '@inertiajs/react';
import Banner from '@/Components/Jetstream/Banner';
import ResponsiveNavLink from '@/Components/Jetstream/ResponsiveNavLink';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import {
  Box,
  CSSObject,
  Divider,
  IconButton,
  Theme,
  styled,
} from '@mui/material';
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import SettingsIcon from '@mui/icons-material/Settings';
import Dropdown from '@/Components/Jetstream/Dropdown';
import DropdownLink from '@/Components/Jetstream/DropdownLink';
import route from 'ziggy-js';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import DashboardIcon from '@mui/icons-material/Dashboard';
import QuizIcon from '@mui/icons-material/Quiz';
import { asset } from '@/Models/Helper';
import { User } from '@/types';

interface Props {
  title: string;
  renderHeader?(): JSX.Element;
}

const drawerWidth = 240;
const navHeight = 70;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: prop => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

function logout(e: React.FormEvent) {
  e.preventDefault();
  router.post(route('logout'));
}

export default function DashboardLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const { props } = usePage();
  const user = props.user as unknown as User;

  const toggleDrawer =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return;
      }
      setIsSidebarOpen(open);
    };

  const sideBar = () => (
    <Box sx={{ width: 250 }} role="presentation">
      <ul className="my-1">
        <li>
          <ResponsiveNavLink
            href={route('profile.show')}
            active={route().current('profile.show')}
          >
            <div className="flex gap-3">
              <img
                src={
                  user.profile_photo_path
                    ? asset('public', user.profile_photo_path)
                    : asset('root', 'assets/image/default-profile.png')
                }
                alt={user.name}
                className="rounded-full h-10 w-10 object-cover"
              />
              <div className="my-auto flex-col text-lg">
                <p>{user.name}</p>
                <p className="text-sm">{user.email}</p>
              </div>
            </div>
          </ResponsiveNavLink>
        </li>
        <li>
          <ResponsiveNavLink
            href={route('dashboard')}
            active={route().current('dashboard')}
          >
            <span className={isSidebarOpen ? 'mr-0' : 'mr-4'}>
              <DashboardIcon fontSize="large" />
            </span>
            Dashboard
          </ResponsiveNavLink>
        </li>
      </ul>
    </Box>
  );

  return (
    <div>
      <Head>
        <title>{title || 'ABC CAT'}</title>
        <meta name="description" content="ABC CAT" />
        <link rel="icon" href={asset('root', 'assets/image/icon.png')} />
      </Head>
      <Box sx={{ display: 'flex' }}>
        <AppBar position="absolute" open={isSidebarOpen}>
          <Banner />
          <nav
            className="flex justify-between w-full sticky bg-main-blue my-auto px-7 shadow  bg-white"
            style={{ height: navHeight }}
          >
            <div className="flex gap-3 max-w-6xl mr-30 text-3xl">
              <button
                className=" md:ml-20 bg-main-blue text-black px-3 py-2"
                onClick={toggleDrawer(!isSidebarOpen)}
              >
                <MenuIcon fontSize="large" />
              </button>
            </div>
            <div className="flex justify-center w-full py-1">
              <img src={asset('root', 'assets/image/logo.png')} className="" />
            </div>
            <div className="mr-3 relative my-auto">
              <Dropdown
                align="right"
                width="48"
                renderTrigger={() => (
                  <button className="flex text-sm text-black border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
                    <SettingsIcon fontSize="large" />
                  </button>
                )}
              >
                {/* <!-- Account Management --> */}
                <div className="block px-4 py-2 text-xs text-gray-400">
                  Manage Account
                </div>
                <DropdownLink href={route('profile.show')}>
                  Profile
                </DropdownLink>
                <div className="border-t border-gray-100"></div>

                {/* <!-- Authentication --> */}
                <form onSubmit={logout}>
                  <DropdownLink as="button">
                    <div className="text-red-700 font-bold">Log Out</div>{' '}
                  </DropdownLink>
                </form>
              </Dropdown>
            </div>
          </nav>
        </AppBar>
        <Drawer variant="permanent" open={isSidebarOpen}>
          <DrawerHeader>
            <IconButton onClick={toggleDrawer(!isSidebarOpen)}>
              <ChevronLeftIcon />
            </IconButton>
          </DrawerHeader>
          <Divider />
          {sideBar()}
        </Drawer>
        <Box
          component="main"
          sx={{ flexGrow: 1, p: 3, marginTop: `${navHeight}px` }}
        >
          <div className="p-5">{children}</div>
        </Box>
      </Box>
    </div>
  );
}
