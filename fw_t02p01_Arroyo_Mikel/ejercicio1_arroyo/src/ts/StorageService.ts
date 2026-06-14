import { AuthSession } from "./AuthSession.js";
import { MyMeal } from "./MyMeal.js";
import { User } from "./User.js";
import { UserMeal } from "./UserMeal.js";

export class StorageService {
    private USER_KEY_ITEM: string = "users";
    private AUTH_SESSION_KEY_ITEM: string = "session";
    private USER_MEAL_KEY_ITEM: string = "userMeals_";

    public registrarUsuario(nuevoUsuario: User) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        users.push(nuevoUsuario);

        localStorage.setItem(this.USER_KEY_ITEM, JSON.stringify(users));
        this.setUsuarioActual(nuevoUsuario);
    }

    public setUsuarioActual(usuario: User): void {
        const usuarioAGuardar = new AuthSession(
            usuario.id,
            usuario.name,
            new Date(),
        );
        localStorage.setItem(
            this.AUTH_SESSION_KEY_ITEM,
            JSON.stringify(usuarioAGuardar),
        );
    }

    public getUsuarioActual(): User | null {
        const usersinProcesar: string | null = localStorage.getItem(
            this.AUTH_SESSION_KEY_ITEM,
        );

        if (usersinProcesar === null) return null;

        const usuarioProcesado: AuthSession =
            AuthSession.fromJSON(usersinProcesar);

        return this.buscarUsuarioPorId(usuarioProcesado.getId());
    }

    public removeUsuarioActual(): void {
        localStorage.removeItem(this.AUTH_SESSION_KEY_ITEM);
    }

    public buscarPorEmail(correo: string) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        const usuarioEncontrado = users.find((us) => us.email === correo);

        if (usuarioEncontrado === undefined) return null;

        return usuarioEncontrado;
    }

    private buscarUsuarioPorId(id: User["id"]) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        const usuarioEncontrado = users.find((us) => us.id === id);

        if (usuarioEncontrado === undefined) return null;

        return usuarioEncontrado;
    }

    public actualizarDatosUsuario(usuario: User) {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        const usuarioEncontrado = users.find(
            (us) => us.email === usuario.email,
        );
        if (usuarioEncontrado) {
            usuarioEncontrado.favoriteCategory = usuario.favoriteCategory;
            localStorage.setItem(this.USER_KEY_ITEM, JSON.stringify(users));
        } else {
            throw new Error("El usuario no existe");
        }
    }

    public nextId(): User["id"] {
        const users: User[] = JSON.parse(
            localStorage.getItem(this.USER_KEY_ITEM) ?? "[]",
        );

        let ultimoId = 0;

        users.forEach((us) => {
            if (us.id > ultimoId) ultimoId = us.id;
        });

        return ultimoId + 1;
    }

    public obtenerFavoritos(id: User["id"]): UserMeal[] {
        const favoritosUserSinProcesar =
            localStorage.getItem(this.USER_MEAL_KEY_ITEM + id) ?? "[]";
        const favoritosUserProcesados: UserMeal[] = JSON.parse(
            favoritosUserSinProcesar,
        );

        return favoritosUserProcesados;
    }

    public agregarFavorito(platoGuardar: UserMeal, id: User["id"]): void {
        const favoritosUserProcesados: UserMeal[] = this.obtenerFavoritos(id);

        favoritosUserProcesados.push(platoGuardar);

        localStorage.setItem(
            this.USER_MEAL_KEY_ITEM + id,
            JSON.stringify(favoritosUserProcesados),
        );
    }
    public buscarFavorito(
        platoId: MyMeal["idMeal"],
        id: User["id"],
    ): UserMeal | undefined {
        const favoritosUserProcesados: UserMeal[] = this.obtenerFavoritos(id);

        return favoritosUserProcesados.find(
            (plato) => plato.mealId === platoId,
        );
    }

    public eliminarFavorito(
        platoId: MyMeal["idMeal"],
        id: User["id"],
    ): void {
        const favoritosUserProcesados: UserMeal[] = this.obtenerFavoritos(id);

        const indexPlato = favoritosUserProcesados.findIndex(
            (plato) => plato.mealId === platoId,
        );
        favoritosUserProcesados.splice(indexPlato, 1);

        localStorage.setItem(
            this.USER_MEAL_KEY_ITEM + id,
            JSON.stringify(favoritosUserProcesados),
        );
    }
    public actualizarPlatoFavorito(platoActualizar: UserMeal, id: User["id"]) {
        const favoritosUserProcesados: UserMeal[] = this.obtenerFavoritos(id);

        const indexPlato = favoritosUserProcesados.findIndex(
            (plato) => plato.mealId === platoActualizar.mealId,
        );

        favoritosUserProcesados[indexPlato].status = platoActualizar.status
        favoritosUserProcesados[indexPlato].notes = platoActualizar.notes
        favoritosUserProcesados[indexPlato].rating = platoActualizar.rating

        localStorage.setItem(
            this.USER_MEAL_KEY_ITEM + id,
            JSON.stringify(favoritosUserProcesados),
        );
    }
}
