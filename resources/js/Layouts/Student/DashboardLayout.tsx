import React, { PropsWithChildren } from 'react';
import { Head, InertiaLink } from '@inertiajs/inertia-react';
import Banner from '@/Components/Jetstream/Banner';
import ResponsiveNavLink from '@/Components/Jetstream/ResponsiveNavLink';
import { Inertia } from '@inertiajs/inertia';
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

interface Props {
  title: string;
  renderHeader?(): JSX.Element;
}

const drawerWidth = 240;

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
  Inertia.post(route('logout'));
}

export default function DashboardLayout({
  title,
  renderHeader,
  children,
}: PropsWithChildren<Props>) {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

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
      <ul className="my-10">
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
      <Head title={title || 'ABC'} />
      <Banner />
      <Box sx={{ display: 'flex' }}>
        <AppBar position="fixed" open={isSidebarOpen}>
          <nav className="flex justify-between w-full sticky bg-blue-400 py-5 pr-7 shadow shadow-sky-400/50">
            <div className="flex gap-3 mr-30">
              <button
                className="text-3xl  bg-blue-400 text-white hover:bg-blue-600 px-3 py-2"
                onClick={toggleDrawer(!isSidebarOpen)}
              >
                <MenuIcon fontSize="large" /> Siswa
              </button>
            </div>
            <div className="mr-3 relative">
              <Dropdown
                align="right"
                width="48"
                renderTrigger={() => (
                  <button className="flex text-sm text-white pt-1 border-2 border-transparent rounded-full focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out">
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
                  <DropdownLink as="button">Log Out</DropdownLink>
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
        <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
          <div className="py-12 max-w-7xl mx-auto sm:px-6 lg:px-8 my-10">
            <div className="overflow-hidden shadow-2xl sm:rounded-3xl bg-white shadow-sky-400/50 p-5">
              {children}
            </div>
          </div>
        </Box>
      </Box>
    </div>
  );
}
