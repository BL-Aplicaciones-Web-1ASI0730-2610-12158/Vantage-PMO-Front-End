import { createApp } from 'vue'
import './style.css'
import App from './app.vue'
import router from './router.js'
import pinia from './pinia.js'
import i18n from './i18n.js'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import {
    Avatar, AvatarGroup, Button, Card, Checkbox, Column,
    ConfirmationService, ConfirmDialog,
    DataTable, Dialog, DialogService,
    Drawer, FileUpload, FloatLabel,
    IconField, InputIcon, InputNumber,
    InputText, Menu, ProgressBar, Rating, Row,
    Select, SelectButton, Tag, Textarea, Timeline,
    Toast, ToastService, Toolbar, Tooltip
} from 'primevue'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(i18n)
app.use(PrimeVue, { theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } }, ripple: true })
app.use(ConfirmationService)
app.use(DialogService)
app.use(ToastService)

app.component('pv-button',         Button)
app.component('pv-card',           Card)
app.component('pv-checkbox',       Checkbox)
app.component('pv-column',         Column)
app.component('pv-confirm-dialog', ConfirmDialog)
app.component('pv-data-table',     DataTable)
app.component('pv-dialog',         Dialog)
app.component('pv-drawer',         Drawer)
app.component('pv-file-upload',    FileUpload)
app.component('pv-float-label',    FloatLabel)
app.component('pv-icon-field',     IconField)
app.component('pv-input-icon',     InputIcon)
app.component('pv-input-number',   InputNumber)
app.component('pv-input-text',     InputText)
app.component('pv-menu',           Menu)
app.component('pv-rating',         Rating)
app.component('pv-row',            Row)
app.component('pv-select',         Select)
app.component('pv-select-button',  SelectButton)
app.component('pv-tag',            Tag)
app.component('pv-textarea',       Textarea)
app.component('pv-toast',          Toast)
app.component('pv-toolbar',        Toolbar)
app.component('pv-avatar',         Avatar)
app.component('pv-avatar-group',   AvatarGroup)
app.component('pv-progressbar',    ProgressBar)
app.component('pv-timeline',       Timeline)
app.directive('tooltip',           Tooltip)

app.mount('#app')
