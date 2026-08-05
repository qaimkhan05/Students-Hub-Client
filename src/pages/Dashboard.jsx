import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Download,
  Edit3,
  FileText,
  Image as ImageIcon,
  Package,
  Plus,
  RefreshCw,
  Save,
  Search,
  ShieldCheck,
  ShoppingBag,
  Trash2,
  UserCog,
  Users,
  X,
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import api, { assetUrl } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/format';

const createEmptyProductForm = () => ({
  id: '',
  title: '',
  category: 'Notes',
  price: '',
  isFree: false,
  thumbnailUrl: '',
  fileUrl: '',
  thumbnailUpload: null,
  courseUpload: null,
  description: '',
});

const productCategories = ['Notes', 'Coding Projects', 'Templates', 'Books', 'Other'];
const thumbnailAccept = 'image/png,image/jpeg,image/webp,image/gif';
const courseFileAccept = '.pdf,.zip,.doc,.docx,.ppt,.pptx,.xlsx,.txt,.rar,.7z,.epub,.mobi,.azw';
const bookFileAccept = '.pdf,.epub,.mobi,.azw,.doc,.docx,.txt,.zip';
const thumbnailMaxBytes = 5 * 1024 * 1024;
const courseFileMaxBytes = 950 * 1024 * 1024;
const bookFileMaxBytes = 950 * 1024 * 1024;
const uploadRequestTimeout = 60 * 60 * 1000;

const panelTabs = {
  admin: [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: 'Users' },
    { id: 'catalog', label: 'Products' },
    { id: 'orders', label: 'Orders' },
  ],
  user: [
    { id: 'overview', label: 'Overview' },
    { id: 'library', label: 'My library' },
  ],
};

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const panelType = isAdmin ? 'admin' : 'user';
  const tabs = panelTabs[panelType];
  const [activeTab, setActiveTab] = useState('overview');
  const [adminStats, setAdminStats] = useState(null);
  const [adminUsers, setAdminUsers] = useState([]);
  const [adminOrders, setAdminOrders] = useState([]);
  const [adminProducts, setAdminProducts] = useState([]);
  const [workspace, setWorkspace] = useState(null);
  const [productForm, setProductForm] = useState(createEmptyProductForm);
  const [userDrafts, setUserDrafts] = useState({});
  const [search, setSearch] = useState({ users: '', products: '', orders: '' });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [lastUpdated, setLastUpdated] = useState('');
  const [downloadingProductId, setDownloadingProductId] = useState('');
  const currentTab = tabs.some((tab) => tab.id === activeTab) ? activeTab : 'overview';

  const loadDashboard = async (silent = false) => {
    if (silent) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      if (isAdmin) {
        const [statsResponse, usersResponse, ordersResponse, productsResponse] =
          await Promise.all([
            api.get('/admin/stats'),
            api.get('/admin/users'),
            api.get('/admin/orders'),
            api.get('/products'),
          ]);
        setAdminStats(statsResponse.data.data);
        setAdminUsers(usersResponse.data.data);
        setAdminOrders(ordersResponse.data.data);
        setAdminProducts(productsResponse.data.data);
      } else {
        const response = await api.get('/dashboard');
        setWorkspace(response.data.data);
      }
      setLastUpdated(new Date().toLocaleString());
    } catch (err) {
      toast.error(err.response?.data?.message || 'Dashboard data could not be loaded');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      loadDashboard();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isAdmin]);

  const resetProductForm = () => setProductForm(createEmptyProductForm());

  const refreshDashboard = async (message = '') => {
    await loadDashboard(true);
    resetProductForm();
    if (message) {
      toast.success(message);
    }
  };

  const handleProductAssetSelection = (field, maxBytes, label) => (event) => {
    const selectedFile = event.target.files?.[0];
    event.target.value = '';
    if (!selectedFile) {
      return;
    }
    if (selectedFile.size > maxBytes) {
      toast.error(label + ' must be ' + Math.floor(maxBytes / (1024 * 1024)) + ' MB or smaller');
      return;
    }
    setProductForm((current) => ({ ...current, [field]: selectedFile }));
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const payload = await buildProductPayload(productForm);
      if (productForm.id) {
        await api.put('/products/' + productForm.id, payload, { timeout: uploadRequestTimeout });
        await refreshDashboard('Product updated successfully');
      } else {
        await api.post('/products', payload, { timeout: uploadRequestTimeout });
        await refreshDashboard('Product added successfully');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Product could not be saved');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) {
      return;
    }
    try {
      await api.delete('/products/' + id);
      await refreshDashboard('Product deleted');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Product could not be deleted');
    }
  };

  const handleUserDraftChange = (id, key, value) => {
    setUserDrafts((current) => ({
      ...current,
      [id]: { ...(current[id] || {}), [key]: value },
    }));
  };

  const handleUserSave = async (id, baseUser) => {
    const draft = userDrafts[id];
    if (!draft || Object.keys(draft).length === 0) {
      toast.error('There are no changes to save');
      return;
    }
    try {
      await api.put('/admin/users/' + id, {
        name: draft.name ?? baseUser.name,
        role: draft.role ?? baseUser.role,
        isVerified: draft.isVerified !== undefined ? draft.isVerified : baseUser.isVerified,
        profile: {
          ...(baseUser.profile || {}),
          headline: draft.headline ?? baseUser.profile?.headline ?? '',
          location: draft.location ?? baseUser.profile?.location ?? '',
          phone: draft.phone ?? baseUser.profile?.phone ?? '',
        },
      });
      setUserDrafts((current) => {
        const next = { ...current };
        delete next[id];
        return next;
      });
      await loadDashboard(true);
      toast.success('User updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'User could not be updated');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and their related records?')) {
      return;
    }
    try {
      await api.delete('/admin/users/' + id);
      await loadDashboard(true);
      toast.success('User deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'User could not be deleted');
    }
  };

  const handleOrderStatus = async (id, status) => {
    try {
      await api.put('/admin/orders/' + id, { status });
      await loadDashboard(true);
      toast.success('Order updated successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order could not be updated');
    }
  };

  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Delete this order permanently?')) {
      return;
    }
    try {
      await api.delete('/admin/orders/' + id);
      await loadDashboard(true);
      toast.success('Order deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order could not be deleted');
    }
  };

  const handleDownloadProduct = async (product) => {
    if (!product?._id) {
      return;
    }

    setDownloadingProductId(product._id);
    try {
      const response = await api.get('/products/' + product._id + '/download', {
        responseType: 'blob',
        timeout: 10 * 60 * 1000,
      });
      const contentType = response.headers['content-type'] || 'application/octet-stream';
      const downloadUrl = URL.createObjectURL(new Blob([response.data], { type: contentType }));
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getDownloadFileName(product, response.headers['content-disposition']);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
      toast.success('Download started');
    } catch (err) {
      toast.error(err.response?.data?.message || 'The resource could not be downloaded');
    } finally {
      setDownloadingProductId('');
    }
  };

  const handleRemoveFromLibrary = async (order, product) => {
    if (!product?._id || !order?._id) {
      return;
    }

    if (!window.confirm('Remove "' + (product.title || 'this item') + '" from your library? You will lose access to this file.')) {
      return;
    }

    try {
      await api.delete('/dashboard/library/' + order._id + '/' + product._id);
      await loadDashboard(true);
      toast.success('Item removed from your library');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Item could not be removed');
    }
  };

  const filteredUsers = useMemo(() => {
    const query = normalizeSearch(search.users);
    if (!query) {
      return adminUsers;
    }
    return adminUsers.filter((entry) =>
      [
        entry.name,
        entry.email,
        entry.role,
        entry.profile?.headline,
        entry.profile?.location,
        entry.isVerified ? 'verified' : 'pending',
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [adminUsers, search.users]);

  const filteredProducts = useMemo(() => {
    const query = normalizeSearch(search.products);
    if (!query) {
      return adminProducts;
    }
    return adminProducts.filter((product) =>
      [product.title, product.category, product.description]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [adminProducts, search.products]);

  const filteredOrders = useMemo(() => {
    const query = normalizeSearch(search.orders);
    if (!query) {
      return adminOrders;
    }
    return adminOrders.filter((order) =>
      [
        order.user?.name,
        order.user?.email,
        order.status,
        order.transactionId,
        order.products?.map((product) => product.title).join(' '),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(query)
    );
  }, [adminOrders, search.orders]);

  const updateSearch = (key, value) => setSearch((current) => ({ ...current, [key]: value }));

  if (loading) {
    return <DashboardLoader />;
  }

  const userOrders = workspace?.orders || [];
  const completedOrders = userOrders.filter((order) => order.status === 'Completed').length;
  const profileCompleteness = Number(workspace?.summary?.profileCompleteness || 0);

  return (
    <div className="dashboard-shell space-y-5">
      <SimpleDashboardHeader
        user={user}
        isAdmin={isAdmin}
        lastUpdated={lastUpdated}
        refreshing={refreshing}
        onRefresh={() => loadDashboard(true)}
      />

      <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-3 dark:border-slate-800">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const count = tab.id === 'library' ? userOrders.length : 0;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={
                isActive
                  ? 'inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white dark:bg-sky-500 dark:text-slate-950'
                  : 'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900'
              }
            >
              {tab.label}
              {count ? (
                <span className={isActive ? 'rounded-full bg-white/20 px-1.5 py-0.5 text-xs' : 'rounded-full bg-slate-200 px-1.5 py-0.5 text-xs dark:bg-slate-800'}>
                  {count}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {isAdmin ? (
        <>
          {currentTab === 'overview' ? (
            <AdminOverview stats={adminStats} users={adminUsers} orders={adminOrders} products={adminProducts} onOpenTab={setActiveTab} />
          ) : null}
          {currentTab === 'users' ? (
            <AdminUsersPanel
              users={filteredUsers}
              totalUsers={adminUsers.length}
              searchValue={search.users}
              onSearch={(value) => updateSearch('users', value)}
              userDrafts={userDrafts}
              onDraftChange={handleUserDraftChange}
              onSave={handleUserSave}
              onDelete={handleDeleteUser}
            />
          ) : null}
          {currentTab === 'catalog' ? (
            <AdminCatalogPanel
              productForm={productForm}
              products={filteredProducts}
              totalProducts={adminProducts.length}
              searchValue={search.products}
              onSearch={(value) => updateSearch('products', value)}
              onFormChange={setProductForm}
              onSubmit={handleProductSubmit}
              onReset={resetProductForm}
              onSelectThumbnail={handleProductAssetSelection('thumbnailUpload', thumbnailMaxBytes, 'Thumbnail image')}
              onSelectCourse={handleProductAssetSelection(
                'courseUpload',
                productForm.category === 'Books' ? bookFileMaxBytes : courseFileMaxBytes,
                productForm.category === 'Books' ? 'Book file' : 'Resource file'
              )}
              fileAccept={productForm.category === 'Books' ? bookFileAccept : courseFileAccept}
              fileLabel={productForm.category === 'Books' ? 'Book file' : 'Resource file'}
              submitting={submitting}
              onEdit={(product) => setProductForm(mapProductToForm(product))}
              onDelete={handleDeleteProduct}
            />
          ) : null}
          {currentTab === 'orders' ? (
            <AdminOrdersPanel
              orders={filteredOrders}
              totalOrders={adminOrders.length}
              searchValue={search.orders}
              onSearch={(value) => updateSearch('orders', value)}
              onStatusChange={handleOrderStatus}
              onDelete={handleDeleteOrder}
            />
          ) : null}
        </>
      ) : (
        <>
          {currentTab === 'overview' ? (
            <UserOverview
              user={user}
              workspace={workspace}
              orders={userOrders}
              completedOrders={completedOrders}
              profileCompleteness={profileCompleteness}
              onOpenLibrary={() => setActiveTab('library')}
            />
          ) : null}
          {currentTab === 'library' ? (
            <UserLibrary
              orders={userOrders}
              onDownload={handleDownloadProduct}
              downloadingProductId={downloadingProductId}
              onRemove={handleRemoveFromLibrary}
            />
          ) : null}
        </>
      )}
    </div>
  );
};

const SimpleDashboardHeader = ({ user, isAdmin, lastUpdated, refreshing, onRefresh }) => (
  <header className="flex min-w-0 flex-col gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center sm:justify-between">
    <div className="min-w-0">
      <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">
        {isAdmin ? 'Admin panel' : 'User panel'}
      </p>
      <h1 className="mt-1 break-words text-2xl font-bold text-slate-950 dark:text-white">
        Hello, {user?.name || 'there'}
      </h1>
      <p className="mt-1 break-words text-sm text-slate-600 dark:text-slate-300">
        {isAdmin ? 'Manage users, digital products, and orders.' : 'Manage your profile and purchased resources.'}
      </p>
    </div>
    <div className="flex min-w-0 flex-wrap items-center gap-2 sm:justify-end">
      <span className="max-w-full break-words text-xs text-slate-500 dark:text-slate-400">Updated {lastUpdated || 'just now'}</span>
      <button
        type="button"
        onClick={onRefresh}
        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      >
        <RefreshCw className={refreshing ? 'h-4 w-4 animate-spin' : 'h-4 w-4'} />
        Refresh
      </button>
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white dark:bg-sky-500 dark:text-slate-950">
        {user?.name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    </div>
  </header>
);

const AdminOverview = ({ stats, users, orders, products, onOpenTab }) => {
  const verifiedUsers = users.filter((user) => user.isVerified).length;
  const cards = [
    { label: 'Users', value: stats?.totalUsers || users.length, tone: 'blue', icon: <Users className="h-4 w-4" /> },
    { label: 'Products', value: stats?.totalProducts || products.length, tone: 'green', icon: <Package className="h-4 w-4" /> },
    { label: 'Orders', value: stats?.totalOrders || orders.length, tone: 'amber', icon: <ShoppingBag className="h-4 w-4" /> },
    { label: 'Revenue', value: 'Rs. ' + (stats?.totalRevenue || 0), tone: 'slate', icon: <CheckCircle2 className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-5">
      <SimpleStats items={cards} />
      <div className="grid min-w-0 gap-5 lg:grid-cols-2">
        <SimplePanel title="Account summary" description="A quick view of member records." icon={<UserCog className="h-4 w-4" />}>
          <div className="grid gap-3 sm:grid-cols-2">
            <SummaryBox label="Verified users" value={verifiedUsers} />
            <SummaryBox label="Pending verification" value={Math.max(0, users.length - verifiedUsers)} />
          </div>
          <button type="button" onClick={() => onOpenTab('users')} className="mt-4 text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200">
            Manage users
          </button>
        </SimplePanel>
        <SimplePanel
          title="Recent orders"
          description="The latest purchases from your digital store."
          icon={<ShoppingBag className="h-4 w-4" />}
          action={<button type="button" onClick={() => onOpenTab('orders')} className="text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200">View all</button>}
        >
          <OrderList orders={orders.slice(0, 5)} compact />
        </SimplePanel>
      </div>
      <SimplePanel
        title="Product catalog"
        description="Keep your notes, templates, and digital files available to users."
        icon={<Package className="h-4 w-4" />}
        action={<button type="button" onClick={() => onOpenTab('catalog')} className="inline-flex items-center gap-1 text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200">Manage products <Plus className="h-4 w-4" /></button>}
      >
        <ProductList products={products.slice(0, 4)} compact />
      </SimplePanel>
    </div>
  );
};

const AdminUsersPanel = ({ users, totalUsers, searchValue, onSearch, userDrafts, onDraftChange, onSave, onDelete }) => (
  <SimplePanel title="Users" description="Update access, verification, and basic profile information." icon={<Users className="h-4 w-4" />}>
    <SearchBar value={searchValue} onChange={onSearch} placeholder="Search by name, email, role, or location" summary={'Showing ' + users.length + ' of ' + totalUsers} />
    <div className="mt-4 space-y-3">
      {users.length ? users.map((entry) => (
        <UserRow key={entry.id} user={entry} draft={userDrafts[entry.id] || {}} onDraftChange={onDraftChange} onSave={onSave} onDelete={onDelete} />
      )) : <EmptyState label="No users match this search." />}
    </div>
  </SimplePanel>
);

const AdminCatalogPanel = ({
  productForm,
  products,
  totalProducts,
  searchValue,
  onSearch,
  onFormChange,
  onSubmit,
  onReset,
  onSelectThumbnail,
  onSelectCourse,
  fileAccept,
  fileLabel,
  submitting,
  onEdit,
  onDelete,
}) => (
  <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
    <SimplePanel title={productForm.id ? 'Edit product' : 'Add product'} description="Add a digital resource with a title, price, cover, and file." icon={<Package className="h-4 w-4" />}>
      <ProductForm form={productForm} onChange={onFormChange} onSubmit={onSubmit} onReset={onReset} onSelectThumbnail={onSelectThumbnail} onSelectCourse={onSelectCourse} fileAccept={fileAccept} fileLabel={fileLabel} submitting={submitting} />
    </SimplePanel>
    <SimplePanel title="Products" description="Edit or remove items currently visible in the store." icon={<ShoppingBag className="h-4 w-4" />}>
      <SearchBar value={searchValue} onChange={onSearch} placeholder="Search products" summary={'Showing ' + products.length + ' of ' + totalProducts} />
      <div className="mt-4"><ProductList products={products} onEdit={onEdit} onDelete={onDelete} /></div>
    </SimplePanel>
  </div>
);

const AdminOrdersPanel = ({ orders, totalOrders, searchValue, onSearch, onStatusChange, onDelete }) => (
  <SimplePanel title="Orders" description="Update order status and keep purchase records organized." icon={<ShoppingBag className="h-4 w-4" />}>
    <SearchBar value={searchValue} onChange={onSearch} placeholder="Search by customer, email, transaction, or product" summary={'Showing ' + orders.length + ' of ' + totalOrders} />
    <div className="mt-4"><OrderList orders={orders} onStatusChange={onStatusChange} onDelete={onDelete} /></div>
  </SimplePanel>
);

const UserOverview = ({ user, workspace, orders, completedOrders, profileCompleteness, onOpenLibrary }) => (
  <div className="space-y-5">
    <SimpleStats
      items={[
        { label: 'Purchases', value: orders.length, tone: 'blue', icon: <ShoppingBag className="h-4 w-4" /> },
        { label: 'Completed orders', value: completedOrders, tone: 'green', icon: <CheckCircle2 className="h-4 w-4" /> },
        { label: 'Profile complete', value: profileCompleteness + '%', tone: 'slate', icon: <ShieldCheck className="h-4 w-4" /> },
      ]}
    />
    <div className="grid min-w-0 gap-5 lg:grid-cols-2">
      <SimplePanel
        title="Profile"
        description="Keep your account information ready and up to date."
        icon={<ShieldCheck className="h-4 w-4" />}
        action={<Link to="/profile" className="text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200">Edit profile</Link>}
      >
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <p className="break-words text-sm font-semibold text-slate-700 dark:text-slate-200">{user?.name || 'Your profile'}</p>
              <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">{user?.email || 'No email available'}</p>
            </div>
            <span className="shrink-0 text-xl font-bold text-slate-900 dark:text-white">{profileCompleteness}%</span>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div className="h-full rounded-full bg-sky-600 dark:bg-sky-400" style={{ width: profileCompleteness + '%' }} />
          </div>
        </div>
      </SimplePanel>
      <SimplePanel
        title="Recent purchases"
        description="Open your latest digital resources."
        icon={<Download className="h-4 w-4" />}
        action={<button type="button" onClick={onOpenLibrary} className="text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200">View library</button>}
      >
        <OrderList orders={orders.slice(0, 3)} compact />
      </SimplePanel>
    </div>
    {!workspace?.orders?.length ? (
      <SimplePanel title="Start with the store" description="Browse digital resources and keep them in your library." icon={<Package className="h-4 w-4" />}>
        <Link to="/store" className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400">Visit store</Link>
      </SimplePanel>
    ) : null}
  </div>
);

const UserLibrary = ({ orders, onDownload, downloadingProductId, onRemove }) => (
  <SimplePanel
    title="My library"
    description="Download the resources you have purchased."
    icon={<Download className="h-4 w-4" />}
    action={<Link to="/store" className="text-sm font-semibold text-sky-700 hover:text-sky-900 dark:text-sky-300 dark:hover:text-sky-200">Visit store</Link>}
  >
    {orders.length ? (
      <div className="space-y-3">
        {orders.map((order) => (
          <div key={order._id} className="min-w-0 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="break-words font-semibold text-slate-900 dark:text-white">Order {order.transactionId || order._id?.slice(-6)}</p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{formatDate(order.createdAt)}</p>
              </div>
              <StatusBadge status={order.status} kind="order" />
            </div>
            <div className="mt-3 space-y-2">
              {order.products?.map((product) => (
                <div key={product._id} className="flex min-w-0 flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-3 dark:bg-slate-900">
                  <div className="min-w-0">
                    <p className="break-words text-sm font-semibold text-slate-900 dark:text-white">{product.title}</p>
                    <p className="mt-1 break-words text-xs text-slate-500 dark:text-slate-400">{product.category} · {formatPrice(product.price)}</p>
                  </div>
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => onDownload(product)}
                      disabled={downloadingProductId === product._id}
                      className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-wait disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {downloadingProductId === product._id ? 'Preparing...' : 'Download'}
                    </button>
                    {onRemove ? (
                      <button
                        type="button"
                        onClick={() => onRemove(order, product)}
                        className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:bg-slate-950 dark:text-rose-300 dark:hover:bg-rose-950/30"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        Remove
                      </button>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    ) : <EmptyState label="Your library is empty. Visit the store to purchase a resource." />}
  </SimplePanel>
);

const SimplePanel = ({ title, description, icon, action, children }) => (
  <section className="min-w-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-950">
    <div className="flex min-w-0 items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-200">{icon}</div>
        <div className="min-w-0">
          <h2 className="break-words text-lg font-bold text-slate-950 dark:text-white">{title}</h2>
          <p className="mt-1 break-words text-sm leading-5 text-slate-600 dark:text-slate-300">{description}</p>
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
    <div className="mt-5 min-w-0">{children}</div>
  </section>
);

const SimpleStats = ({ items }) => (
  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
    {items.map((item) => (
      <div key={item.label} className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="flex items-center justify-between gap-3">
          <p className="break-words text-sm font-semibold text-slate-600 dark:text-slate-300">{item.label}</p>
          <span className={'shrink-0 rounded-lg p-2 ' + statTone(item.tone)}>{item.icon}</span>
        </div>
        <p className="mt-3 break-words text-2xl font-bold text-slate-950 dark:text-white">{item.value}</p>
      </div>
    ))}
  </div>
);

const SummaryBox = ({ label, value }) => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
    <p className="break-words text-xs font-bold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-950 dark:text-white">{value}</p>
  </div>
);

const SearchBar = ({ value, onChange, placeholder, summary }) => (
  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
    <label className="relative block min-w-0 flex-1">
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input type="search" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400" />
    </label>
    <span className="shrink-0 text-xs font-semibold text-slate-500 dark:text-slate-400">{summary}</span>
  </div>
);

const UserRow = ({ user, draft, onDraftChange, onSave, onDelete }) => {
  const currentName = draft.name ?? user.name ?? '';
  const currentRole = draft.role ?? user.role ?? 'student';
  const currentVerified = draft.isVerified ?? user.isVerified;
  const currentHeadline = draft.headline ?? user.profile?.headline ?? '';
  const currentLocation = draft.location ?? user.profile?.location ?? '';
  const currentPhone = draft.phone ?? user.profile?.phone ?? '';
  const hasChanges = Object.keys(draft).length > 0;
  const isOwner = Boolean(user.isOwner);

  return (
    <div className="grid min-w-0 gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.35fr)_10rem_auto]">
      <div className="min-w-0">
        <p className="break-words font-semibold text-slate-900 dark:text-white">
          {currentName || 'Unnamed user'}
          {isOwner ? <span className="ml-2 inline-flex rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">Owner</span> : null}
        </p>
        <p className="mt-1 break-all text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <StatusBadge status={currentRole} kind="role" />
          <StatusBadge status={currentVerified ? 'Verified' : 'Pending'} kind="verification" />
        </div>
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <AdminField label="Name" value={currentName} onChange={(value) => onDraftChange(user.id, 'name', value)} />
        <AdminField label="Phone" value={currentPhone} onChange={(value) => onDraftChange(user.id, 'phone', value)} />
        <AdminField label="Headline" value={currentHeadline} onChange={(value) => onDraftChange(user.id, 'headline', value)} />
        <AdminField label="Location" value={currentLocation} onChange={(value) => onDraftChange(user.id, 'location', value)} />
      </div>
      <div className="grid min-w-0 gap-3">
        <SelectField label="Role" value={currentRole} disabled={isOwner} onChange={(value) => onDraftChange(user.id, 'role', value)} options={['student', 'employer', 'moderator', 'admin']} />
        <SelectField label="Email" value={currentVerified ? 'verified' : 'pending'} onChange={(value) => onDraftChange(user.id, 'isVerified', value === 'verified')} options={['verified', 'pending']} />
      </div>
      <div className="flex flex-wrap items-end gap-2 xl:flex-col xl:items-stretch xl:justify-end">
        <button type="button" disabled={!hasChanges} onClick={() => onSave(user.id, user)} className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400 xl:flex-none">
          <Save className="h-4 w-4" /> Save
        </button>
        {!isOwner ? (
          <button type="button" onClick={() => onDelete(user.id)} className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-200 px-3 py-2.5 text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/30" title="Delete user">
            <Trash2 className="h-4 w-4" /><span className="xl:hidden">Delete</span>
          </button>
        ) : null}
      </div>
    </div>
  );
};

const AdminField = ({ label, value, onChange }) => (
  <label className="block min-w-0">
    <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    <input type="text" value={value} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400" />
  </label>
);

const SelectField = ({ label, value, onChange, options, disabled }) => (
  <label className="block min-w-0">
    <span className="mb-1.5 block text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</span>
    <select disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400 dark:disabled:opacity-50">
      {options.map((option) => <option key={option} value={option}>{option}</option>)}
    </select>
  </label>
);

const ProductForm = ({ form, onChange, onSubmit, onReset, onSelectThumbnail, onSelectCourse, fileAccept, fileLabel, submitting }) => {
  const previewUrl = useMemo(() => {
    if (!form.thumbnailUpload) {
      return form.thumbnailUrl;
    }
    return URL.createObjectURL(form.thumbnailUpload);
  }, [form.thumbnailUpload, form.thumbnailUrl]);

  useEffect(
    () => () => {
      if (previewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(previewUrl);
      }
    },
    [previewUrl]
  );

  return (
    <form onSubmit={onSubmit} className="grid min-w-0 gap-3">
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <FormField label="Title" value={form.title} onChange={(value) => onChange((current) => ({ ...current, title: value }))} />
        <FormField label="Category" as="select" value={form.category} options={productCategories} onChange={(value) => onChange((current) => ({ ...current, category: value }))} />
        <div className="min-w-0">
          <FormField label="Price" type="number" value={form.isFree ? 0 : form.price} disabled={form.isFree} onChange={(value) => onChange((current) => ({ ...current, price: value, isFree: false }))} />
          <button
            type="button"
            onClick={() => onChange((current) => ({ ...current, isFree: !current.isFree, price: current.isFree ? '' : 0 }))}
            className={
              form.isFree
                ? 'mt-2 inline-flex items-center gap-2 rounded-lg bg-emerald-100 px-3 py-2 text-xs font-bold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'mt-2 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800'
            }
          >
            {form.isFree ? <CheckCircle2 className="h-3.5 w-3.5" /> : null}
            {form.isFree ? 'Free product' : 'Mark as free'}
          </button>
        </div>
      </div>
      <div className="grid min-w-0 gap-3">
        <UploadField label="Cover image" icon={<ImageIcon className="h-4 w-4" />} accept={thumbnailAccept} selectedLabel={form.thumbnailUpload?.name || form.thumbnailUrl || 'No image selected'} currentUrl={form.thumbnailUpload ? '' : form.thumbnailUrl} onSelect={onSelectThumbnail} previewUrl={previewUrl} />
        <UploadField label={fileLabel} icon={<FileText className="h-4 w-4" />} accept={fileAccept} selectedLabel={form.courseUpload?.name || form.fileUrl || 'No file selected'} currentUrl={form.courseUpload ? '' : form.fileUrl} onSelect={onSelectCourse} />
      </div>
      <div className="grid min-w-0 gap-3 sm:grid-cols-2">
        <FormField label="Cover URL" placeholder="https://..." required={!form.thumbnailUpload} value={form.thumbnailUrl} onChange={(value) => onChange((current) => ({ ...current, thumbnailUrl: value }))} />
        <FormField label="File URL" placeholder="https://..." required={!form.courseUpload} value={form.fileUrl} onChange={(value) => onChange((current) => ({ ...current, fileUrl: value }))} />
      </div>
      <FormField label="Description" as="textarea" value={form.description} onChange={(value) => onChange((current) => ({ ...current, description: value }))} />
      <div className="flex flex-wrap gap-2 pt-1">
        <button type="submit" disabled={submitting} className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-sky-500 dark:text-slate-950 dark:hover:bg-sky-400">
          <Save className="h-4 w-4" /> {submitting ? 'Saving...' : form.id ? 'Update product' : 'Add product'}
        </button>
        {form.id ? <button type="button" onClick={onReset} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"><X className="h-4 w-4" /> Cancel</button> : null}
      </div>
    </form>
  );
};

const FormField = ({ label, value, onChange, as = 'input', type = 'text', options = [], required = true, placeholder = '', disabled = false }) => (
  <label className="block min-w-0">
    <span className="mb-1.5 block text-xs font-semibold text-slate-600 dark:text-slate-300">{label}</span>
    {as === 'textarea' ? (
      <textarea rows="4" value={value} placeholder={placeholder} required={required} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400" />
    ) : as === 'select' ? (
      <select value={value} required={required} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-sky-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400">
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    ) : (
      <input type={type} value={value} placeholder={placeholder} required={required} disabled={disabled} onChange={(event) => onChange(event.target.value)} className="w-full min-w-0 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-500 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:focus:border-sky-400" />
    )}
  </label>
);

const UploadField = ({ label, icon, accept, selectedLabel, currentUrl, onSelect, previewUrl }) => (
  <div className="min-w-0 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
    <div className="flex min-w-0 items-center gap-3">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-slate-700 dark:bg-slate-950 dark:text-slate-200">{icon}</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{selectedLabel}</p>
      </div>
      <label className="inline-flex shrink-0 cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
        Choose
        <input type="file" accept={accept} className="hidden" onChange={onSelect} />
      </label>
    </div>
    {currentUrl ? <a href={assetUrl(currentUrl)} target="_blank" rel="noreferrer" className="mt-2 block break-all text-xs font-semibold text-sky-700 hover:underline dark:text-sky-300">Open current file</a> : null}
    {previewUrl ? <ProductCoverImage src={previewUrl} alt="Product cover preview" className="mt-3 h-28 w-full rounded-lg" /> : null}
  </div>
);

const ProductList = ({ products, onEdit, onDelete, compact = false }) => (
  products.length ? (
    <div className="space-y-3">
      {products.map((product) => (
        <div key={product._id} className="flex min-w-0 flex-col gap-3 rounded-lg border border-slate-200 p-3 sm:flex-row dark:border-slate-800">
          <ProductCoverImage src={product.thumbnailUrl} alt={product.title} className="h-20 w-full shrink-0 rounded-lg sm:w-20" />
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="break-words font-semibold text-slate-900 dark:text-white">{product.title}</p>
                <p className="mt-1 break-words text-xs text-slate-500 dark:text-slate-400">{product.category} · {formatPrice(product.price)}</p>
              </div>
              <span className="shrink-0 text-xs text-slate-500 dark:text-slate-400">{product.salesCount || 0} sales</span>
            </div>
            {!compact ? <p className="mt-2 break-words text-sm leading-5 text-slate-600 dark:text-slate-300">{product.description}</p> : null}
            {onEdit || onDelete ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {onEdit ? <button type="button" onClick={() => onEdit(product)} className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-900"><Edit3 className="h-3.5 w-3.5" /> Edit</button> : null}
                {onDelete ? <button type="button" onClick={() => onDelete(product._id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-xs font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/30"><Trash2 className="h-3.5 w-3.5" /> Delete</button> : null}
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  ) : <EmptyState label="No products available." />
);

const OrderList = ({ orders, onStatusChange, onDelete, compact = false }) => (
  orders.length ? (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order._id} className="min-w-0 rounded-lg border border-slate-200 p-3 dark:border-slate-800">
          <div className="flex min-w-0 flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="break-words font-semibold text-slate-900 dark:text-white">{order.user?.name || 'User'}</p>
              <p className="mt-1 break-all text-xs text-slate-500 dark:text-slate-400">{order.user?.email || 'No email'}</p>
            </div>
            <StatusBadge status={order.status} kind="order" />
          </div>
          <p className="mt-2 break-words text-sm text-slate-600 dark:text-slate-300">{order.products?.map((product) => product.title).join(', ') || 'No products'}</p>
          <div className="mt-2 flex min-w-0 flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-400">
            <span>{formatDate(order.createdAt)}</span>
            <span className="font-semibold text-slate-700 dark:text-slate-200">Rs. {order.totalAmount}</span>
          </div>
          {!compact && onStatusChange ? (
            <div className="mt-3 flex min-w-0 flex-wrap gap-2">
              <select value={order.status} onChange={(event) => onStatusChange(order._id, event.target.value)} className="min-w-0 flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-800 outline-none focus:border-sky-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
              {onDelete ? <button type="button" onClick={() => onDelete(order._id)} className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 dark:border-rose-900/50 dark:text-rose-300 dark:hover:bg-rose-950/30"><Trash2 className="h-4 w-4" /> Delete</button> : null}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  ) : <EmptyState label="No orders available." />
);

const ProductCoverImage = ({ src, alt, className = '' }) => {
  const [failedSrc, setFailedSrc] = useState('');
  const resolvedSrc = assetUrl(src);
  if (!resolvedSrc || failedSrc === resolvedSrc) {
    return <div className={'flex items-center justify-center bg-slate-100 text-slate-400 dark:bg-slate-900 dark:text-slate-500 ' + className}><ImageIcon className="h-5 w-5" /></div>;
  }
  return <img src={resolvedSrc} alt={alt} loading="lazy" onError={() => setFailedSrc(resolvedSrc)} className={'object-cover ' + className} />;
};

const StatusBadge = ({ status, kind = 'order' }) => {
  const value = String(status || 'Unknown');
  let classes = 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300';
  if (kind === 'verification') {
    classes = value === 'Verified' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300';
  } else if (kind === 'role') {
    classes = value === 'admin'
      ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-300'
      : value === 'moderator'
        ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/30 dark:text-indigo-300'
        : 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300';
  } else if (value === 'Completed') {
    classes = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300';
  } else if (value === 'Failed') {
    classes = 'bg-rose-50 text-rose-700 dark:bg-rose-950/30 dark:text-rose-300';
  } else if (value === 'Pending') {
    classes = 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300';
  }
  return <span className={'inline-flex max-w-full break-words rounded-full px-2.5 py-1 text-xs font-semibold ' + classes}>{value}</span>;
};

const EmptyState = ({ label }) => <div className="rounded-lg border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">{label}</div>;

const DashboardLoader = () => (
  <div className="dashboard-shell space-y-5" aria-label="Loading dashboard">
    <div className="h-32 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
    <div className="grid gap-3 sm:grid-cols-3">
      {[1, 2, 3].map((item) => <div key={item} className="h-28 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />)}
    </div>
    <div className="h-72 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-800" />
  </div>
);

const statTone = (tone) => ({
  blue: 'bg-sky-50 text-sky-700 dark:bg-sky-950/30 dark:text-sky-300',
  green: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300',
  slate: 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300',
}[tone] || 'bg-slate-100 text-slate-700 dark:bg-slate-900 dark:text-slate-300');

const normalizeSearch = (value) => String(value || '').trim().toLowerCase();

const getDownloadFileName = (product, contentDisposition = '') => {
  const headerMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (headerMatch?.[1]) {
    return headerMatch[1];
  }

  const extension = product.fileUrl?.split('?')[0].split('.').pop() || 'pdf';
  const safeTitle = (product.title || 'resource').replace(/[^a-z0-9-_ ]/gi, '').trim() || 'resource';
  return `${safeTitle}.${extension}`;
};

const formatDate = (value) => {
  if (!value) {
    return 'Unknown date';
  }
  return new Date(value).toLocaleDateString();
};

const mapProductToForm = (product) => ({
  id: product._id,
  title: product.title || '',
  category: product.category || 'Notes',
  price: product.price ?? '',
  isFree: Number(product.price) === 0,
  thumbnailUrl: product.thumbnailUrl || '',
  fileUrl: product.fileUrl || '',
  thumbnailUpload: null,
  courseUpload: null,
  description: product.description || '',
});

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error('Failed to read ' + file.name));
    reader.readAsDataURL(file);
  });

const buildProductPayload = async (form) => {
  const payload = {
    title: form.title,
    category: form.category,
    price: form.isFree ? 0 : form.price,
    thumbnailUrl: form.thumbnailUrl,
    fileUrl: form.fileUrl,
    description: form.description,
  };
  if (form.thumbnailUpload) {
    payload.thumbnailUpload = await readFileAsDataUrl(form.thumbnailUpload);
  }
  if (form.courseUpload) {
    payload.courseUpload = await readFileAsDataUrl(form.courseUpload);
  }
  return payload;
};

export default Dashboard;
