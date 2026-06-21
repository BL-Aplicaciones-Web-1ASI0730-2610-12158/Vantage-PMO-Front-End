import { defineStore } from 'pinia';
import { ref } from 'vue';
import { workspaceApi } from "../infrastructure/workspace.api.js";
import { SelectWorkspaceCommand } from "../domain/model/select-workspace.command.js";
import useIamStore from "../../iam/application/iam.store.js";

/**
 * Workspace store to manage user workspace selection and preferences.
 */
const useWorkspaceStore = defineStore('workspace', () => {
  const userWorkspace = ref(null);
  const workspaceName = ref('');
  const loading = ref(false);

  const getWorkspaceDisplayName = (role) => {
    switch (role) {
      case 'PROJECT_LEADER': return 'Project Leader';
      case 'ENTERPRISE_OWNER': return 'Enterprise/Owner';
      default: return '';
    }
  };

  /**
   * Guarda la selección del workspace/rol del usuario en el backend y actualiza el estado local.
   * @param {string} selectedRole - El tipo de rol/workspace seleccionado (ej. 'PROJECT_LEADER', 'ENTERPRISE_OWNER').
   * @param {number} [userIdOverride] - ID del usuario cuando aún no está sincronizado en el store IAM.
   * @returns {Promise<boolean>} True si es exitoso, false en caso contrario.
   */
  async function setUserWorkspace(selectedRole, userIdOverride) {
    loading.value = true;
    const iamStore = useIamStore();
    const userId = userIdOverride ?? iamStore.currentUserId;

    if (!userId) {
      console.error('User ID no disponible para establecer el workspace.');
      loading.value = false;
      return false;
    }

    try {
      const command = new SelectWorkspaceCommand(userId, selectedRole);
      const savedRole = await workspaceApi.saveWorkspaceSelection(command);

      if (savedRole) {
        userWorkspace.value = savedRole;
        workspaceName.value = getWorkspaceDisplayName(savedRole);
        localStorage.setItem('userWorkspace', savedRole);
        localStorage.setItem('userWorkspaceName', workspaceName.value);
        localStorage.setItem('workspaceSelectedAt', new Date().toISOString());
        return true;
      } else {
        console.error('Fallo al guardar la selección del workspace a través de la API.');
        return false;
      }
    } catch (error) {
      console.error('Error al establecer el workspace:', error);
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Obtiene la selección del workspace del usuario desde el backend.
   * @returns {Promise<boolean>} True si se encontró y estableció un workspace, false en caso contrario.
   */
  async function fetchUserWorkspace() {
    loading.value = true;
    const iamStore = useIamStore();
    const userId = iamStore.currentUserId;

    if (!userId) {
      console.warn('User ID no disponible para obtener el workspace. El usuario podría no haber iniciado sesión.');
      loading.value = false;
      return false;
    }

    try {
      const selectedRole = await workspaceApi.getWorkspaceSelection(userId);
      if (selectedRole) {
        userWorkspace.value = selectedRole;
        workspaceName.value = getWorkspaceDisplayName(selectedRole);
        localStorage.setItem('userWorkspace', selectedRole);
        localStorage.setItem('userWorkspaceName', workspaceName.value);
        localStorage.setItem('workspaceSelectedAt', new Date().toISOString());
        return true;
      } else {
        clearWorkspace();
        return false;
      }
    } catch (error) {
      console.error('Error al obtener el workspace de la API:', error);
      clearWorkspace();
      return false;
    } finally {
      loading.value = false;
    }
  }

  /**
   * Carga el workspace del usuario desde localStorage, o lo obtiene de la API si no se encuentra.
   * @returns {Promise<boolean>} True si se carga/encuentra un workspace, false en caso contrario.
   */
  async function loadUserWorkspace() {
    const savedWorkspace = localStorage.getItem('userWorkspace');
    const savedName = localStorage.getItem('userWorkspaceName');

    if (savedWorkspace) {
      userWorkspace.value = savedWorkspace;
      workspaceName.value = savedName || '';
      return true;
    } else {
      return await fetchUserWorkspace();
    }
  }

  /**
   * Verifica si el usuario ya ha seleccionado un workspace
   * @returns {boolean} True si se selecciona un workspace, false en caso contrario.
   */
  function hasWorkspaceSelected() {
    return userWorkspace.value !== null;
  }

  /**
   * Limpia la selección del workspace
   */
  function clearWorkspace() {
    userWorkspace.value = null;
    workspaceName.value = '';
    localStorage.removeItem('userWorkspace');
    localStorage.removeItem('userWorkspaceName');
    localStorage.removeItem('workspaceSelectedAt');
  }

  return {
    userWorkspace,
    workspaceName,
    loading,
    setUserWorkspace,
    loadUserWorkspace,
    hasWorkspaceSelected,
    clearWorkspace,
    fetchUserWorkspace
  };
});

export { useWorkspaceStore };
