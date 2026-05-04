import { ApiService } from "./ApiService.js";
import { StorageService } from "./StorageService.js";
import { ViewService } from "./ViewService.js";
import { MyMeal } from "./MyMeal.js";
import { UserOwnRecipe, UserOwnRecipeIngredient } from "./UserOwnRecipe.js";

declare const bootstrap: any;

document.addEventListener("DOMContentLoaded", () => {
    const storage = new StorageService();
    // Si no hay sesión, redirigir al inicio
    if (!storage.getUsuarioActual()) {
        window.location.href = "index.html";
        return;
    }
    cargarSelectsCategoriaArea();
    cargarTablaRecetasPropias();
    cargarEventos();
});

// ── Sección 1: tabla de recetas propias ─────────────────────────────────────

function cargarTablaRecetasPropias(): void {
    const storage = new StorageService();
    const view = new ViewService();
    const usuario = storage.getUsuarioActual();
    if (!usuario) return;

    const wrapperTabla = document.querySelector(
        "#wrapperTabla",
    ) as HTMLDivElement;
    const sinRecetas = document.querySelector(
        "#sinRecetasPropias",
    ) as HTMLDivElement;
    const tbody = document.querySelector(
        "#tablaRecetasPropias tbody",
    ) as HTMLTableSectionElement;

    const recetas = storage.getUserOwnRecipes(usuario.id);

    if (recetas.length === 0) {
        view.mostrarElement(sinRecetas, true);
        view.mostrarElement(wrapperTabla, false);
        return;
    }

    view.mostrarElement(sinRecetas, false);
    view.mostrarElement(wrapperTabla, true);

    tbody.innerHTML = "";
    recetas.forEach((receta) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="text-muted small">${receta.id.substring(0, 8)}…</td>
            <td>${receta.name}</td>
            <td>${receta.category}</td>
            <td>${receta.area}</td>
            <td>${receta.ingredients.length}</td>
            <td>${receta.images.length}</td>
            <td>
                <button class="btn btn-sm btn-outline-info me-1 btn-ver-detalles" data-id="${receta.id}">
                    <i class="bi bi-eye"></i> Ver
                </button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar" data-id="${receta.id}">
                    <i class="bi bi-trash"></i> Eliminar
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });

    tbody.querySelectorAll(".btn-ver-detalles").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = (e.currentTarget as HTMLButtonElement).dataset["id"]!;
            abrirModalDetalles(id);
        });
    });

    tbody.querySelectorAll(".btn-eliminar").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const id = (e.currentTarget as HTMLButtonElement).dataset["id"]!;
            confirmarEliminar(id);
        });
    });
}

function abrirModalDetalles(id: string): void {
    const storage = new StorageService();
    const usuario = storage.getUsuarioActual();
    if (!usuario) return;

    const recetas = storage.getUserOwnRecipes(usuario.id);
    const receta = recetas.find((r) => r.id === id);
    if (!receta) return;

    (
        document.querySelector("#modalDetallesNombre") as HTMLElement
    ).textContent = receta.name;
    (
        document.querySelector("#modalDetallesCategoria") as HTMLElement
    ).textContent = receta.category;
    (
        document.querySelector("#modalDetallesArea") as HTMLElement
    ).textContent = receta.area;
    (
        document.querySelector(
            "#modalDetallesInstrucciones",
        ) as HTMLElement
    ).textContent = receta.instructions || "Sin instrucciones";

    const listaIng = document.querySelector(
        "#modalDetallesIngredientes",
    ) as HTMLUListElement;
    listaIng.innerHTML = receta.ingredients
        .map(
            (ing) =>
                `<li class="list-group-item">${ing.measure} de ${ing.name}</li>`,
        )
        .join("");

    const contenedorImg = document.querySelector(
        "#modalDetallesImagenes",
    ) as HTMLDivElement;
    if (receta.images.length === 0) {
        contenedorImg.innerHTML =
            '<p class="text-muted">Sin imágenes asociadas.</p>';
    } else {
        contenedorImg.innerHTML = receta.images
            .map(
                (img) =>
                    `<img src="${img}" class="img-thumbnail me-2 mb-2" style="max-height:150px" alt="imagen receta">`,
            )
            .join("");
    }

    const modal = document.querySelector("#modalDetalles") as HTMLElement;
    bootstrap.Modal.getOrCreateInstance(modal).show();
}

function confirmarEliminar(id: string): void {
    if (!confirm("¿Seguro que quieres eliminar esta receta?")) return;

    const storage = new StorageService();
    const view = new ViewService();
    const usuario = storage.getUsuarioActual();
    if (!usuario) return;

    storage.deleteUserOwnRecipe(id, usuario.id);
    cargarTablaRecetasPropias();
    view.mostrarNotificacionEstado(true, "Receta eliminada correctamente.");
}

// ── Sección 2: formularios de creación ──────────────────────────────────────

function cargarEventos(): void {
    // Formulario en blanco
    document
        .querySelector("#btnAgregarIngredienteBlanco")
        ?.addEventListener("click", () =>
            agregarFilaIngrediente("listaIngredientesBlanco"),
        );
    document
        .querySelector("#btnAgregarImagenBlanco")
        ?.addEventListener("click", () =>
            agregarFilaImagen("listaImagenesBlanco"),
        );
    document
        .querySelector("#formRecetaBlanco")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarReceta("Blanco");
        });

    // Formulario reutilizar API
    document
        .querySelector("#btnBuscarRecetaApi")
        ?.addEventListener("click", buscarRecetaApi);
    document
        .querySelector("#btnAgregarIngredienteApi")
        ?.addEventListener("click", () =>
            agregarFilaIngrediente("listaIngredientesApi"),
        );
    document
        .querySelector("#btnAgregarImagenApi")
        ?.addEventListener("click", () =>
            agregarFilaImagen("listaImagenesApi"),
        );
    document
        .querySelector("#formRecetaApi")
        ?.addEventListener("submit", (e) => {
            e.preventDefault();
            guardarReceta("Api");
        });

    // Inicializar una fila de ingrediente vacía en cada formulario
    agregarFilaIngrediente("listaIngredientesBlanco");
    agregarFilaIngrediente("listaIngredientesApi");
}

function agregarFilaIngrediente(contenedorId: string): void {
    const contenedor = document.querySelector(
        `#${contenedorId}`,
    ) as HTMLDivElement;
    const div = document.createElement("div");
    div.className = "row g-2 mb-2 fila-ingrediente";
    div.innerHTML = `
        <div class="col-5">
            <input type="text" class="form-control input-ing-nombre" placeholder="Ingrediente">
        </div>
        <div class="col-5">
            <input type="text" class="form-control input-ing-cantidad" placeholder="Cantidad">
        </div>
        <div class="col-2">
            <button type="button" class="btn btn-outline-danger w-100">
                <i class="bi bi-trash"></i>
            </button>
        </div>
    `;
    div.querySelector("button")?.addEventListener("click", () => div.remove());
    contenedor.appendChild(div);
}

function agregarFilaImagen(contenedorId: string, urlInicial?: string): void {
    const contenedor = document.querySelector(
        `#${contenedorId}`,
    ) as HTMLDivElement;
    const div = document.createElement("div");
    div.className = "mb-2 fila-imagen";
    div.innerHTML = `
        <div class="input-group">
            <input type="url" class="form-control input-imagen-url" placeholder="https://…" value="${urlInicial ?? ""}">
            <button type="button" class="btn btn-outline-secondary btn-preview">
                <i class="bi bi-eye"></i>
            </button>
            <button type="button" class="btn btn-outline-danger btn-del-img">
                <i class="bi bi-trash"></i>
            </button>
        </div>
        <div class="preview-imagen mt-1 ${urlInicial ? "" : "d-none"}">
            <img src="${urlInicial ?? ""}" class="img-thumbnail" style="max-height:100px" alt="preview">
        </div>
    `;
    div.querySelector(".btn-del-img")?.addEventListener("click", () =>
        div.remove(),
    );
    div.querySelector(".btn-preview")?.addEventListener("click", () => {
        const urlInput = div.querySelector(
            ".input-imagen-url",
        ) as HTMLInputElement;
        const previewDiv = div.querySelector(
            ".preview-imagen",
        ) as HTMLDivElement;
        const img = previewDiv.querySelector("img") as HTMLImageElement;
        if (urlInput.value.trim()) {
            img.src = urlInput.value.trim();
            previewDiv.classList.remove("d-none");
        }
    });
    contenedor.appendChild(div);
}

async function buscarRecetaApi(): Promise<void> {
    const api = new ApiService();
    const view = new ViewService();
    const input = document.querySelector(
        "#inputBuscarReceta",
    ) as HTMLInputElement;
    const resultados = document.querySelector(
        "#resultadosBusqueda",
    ) as HTMLDivElement;

    if (!input.value.trim()) {
        view.mostrarNotificacionEstado(
            false,
            "Escribe un nombre de receta para buscar.",
        );
        return;
    }

    resultados.innerHTML =
        '<p class="text-muted"><i class="bi bi-hourglass-split"></i> Buscando…</p>';

    try {
        const platos = await api.pedirPlatosPorNombre(input.value.trim());

        if (platos.length === 0) {
            resultados.innerHTML =
                '<p class="text-muted">No se encontraron recetas con ese nombre.</p>';
            return;
        }

        resultados.innerHTML =
            '<p class="text-muted small mb-1">Haz clic en una receta para usar sus datos:</p>';
        platos.forEach((plato) => {
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "btn btn-outline-secondary btn-sm me-2 mb-2";
            btn.textContent = plato.strMeal;
            btn.addEventListener("click", () => prefillFormConReceta(plato));
            resultados.appendChild(btn);
        });
    } catch {
        resultados.innerHTML =
            '<p class="text-danger">Error al conectar con la API.</p>';
    }
}

function prefillFormConReceta(plato: MyMeal): void {
    (
        document.querySelector("#nombreRecetaApi") as HTMLInputElement
    ).value = plato.strMeal;
    (
        document.querySelector("#categoriaApi") as HTMLSelectElement
    ).value = plato.strCategory;
    (document.querySelector("#areaApi") as HTMLSelectElement).value =
        plato.strArea;
    (
        document.querySelector("#instruccionesApi") as HTMLTextAreaElement
    ).value = plato.strInstructions ?? "";

    // Ingredientes
    const listaIng = document.querySelector(
        "#listaIngredientesApi",
    ) as HTMLDivElement;
    listaIng.innerHTML = "";
    plato.ingredients.forEach((ing) => {
        const div = document.createElement("div");
        div.className = "row g-2 mb-2 fila-ingrediente";
        div.innerHTML = `
            <div class="col-5">
                <input type="text" class="form-control input-ing-nombre" value="${ing.name}">
            </div>
            <div class="col-5">
                <input type="text" class="form-control input-ing-cantidad" value="${ing.measure}">
            </div>
            <div class="col-2">
                <button type="button" class="btn btn-outline-danger w-100">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        div.querySelector("button")?.addEventListener("click", () =>
            div.remove(),
        );
        listaIng.appendChild(div);
    });

    // Imagen de la API como punto de partida
    const listaImg = document.querySelector(
        "#listaImagenesApi",
    ) as HTMLDivElement;
    listaImg.innerHTML = "";
    if (plato.strMealThumb) {
        agregarFilaImagen("listaImagenesApi", plato.strMealThumb);
    }

    // Hacer scroll al formulario
    document
        .querySelector("#formRecetaApi")
        ?.scrollIntoView({ behavior: "smooth" });
}

// ── Guardar receta ───────────────────────────────────────────────────────────

function guardarReceta(sufijo: "Blanco" | "Api"): void {
    const storage = new StorageService();
    const view = new ViewService();
    const usuario = storage.getUsuarioActual();
    if (!usuario) return;

    const nombre = (
        document.querySelector(`#nombreReceta${sufijo}`) as HTMLInputElement
    ).value.trim();
    const categoria = (
        document.querySelector(`#categoria${sufijo}`) as HTMLSelectElement
    ).value;
    const area = (
        document.querySelector(`#area${sufijo}`) as HTMLSelectElement
    ).value;
    const instrucciones = (
        document.querySelector(
            `#instrucciones${sufijo}`,
        ) as HTMLTextAreaElement
    ).value.trim();

    // Validar campos obligatorios
    if (!nombre || !categoria || !area) {
        view.mostrarNotificacionEstado(
            false,
            "El nombre, la categoría y el país son obligatorios.",
        );
        return;
    }

    // Validar nombre único
    if (storage.existsUserOwnRecipeByName(nombre, usuario.id)) {
        view.mostrarNotificacionEstado(
            false,
            `Ya tienes una receta llamada "${nombre}". Elige otro nombre.`,
        );
        return;
    }

    // Recoger ingredientes
    const filasIng = document.querySelectorAll(
        `#listaIngredientes${sufijo} .fila-ingrediente`,
    );
    const ingredientes: UserOwnRecipeIngredient[] = [];
    let ingValido = true;

    filasIng.forEach((fila) => {
        const nombreIng = (
            fila.querySelector(".input-ing-nombre") as HTMLInputElement
        ).value.trim();
        const cantidad = (
            fila.querySelector(".input-ing-cantidad") as HTMLInputElement
        ).value.trim();
        if (!nombreIng || !cantidad) {
            ingValido = false;
        } else {
            ingredientes.push({ name: nombreIng, measure: cantidad });
        }
    });

    if (!ingValido || ingredientes.length === 0) {
        view.mostrarNotificacionEstado(
            false,
            "Cada ingrediente debe tener nombre y cantidad. Añade al menos uno.",
        );
        return;
    }

    // Recoger imágenes (validar que no estén vacías ni repetidas ni sean inválidas)
    const filasImg = document.querySelectorAll(
        `#listaImagenes${sufijo} .fila-imagen`,
    );
    const imagenes: string[] = [];
    const urlsVistas = new Set<string>();
    let imgValida = true;

    filasImg.forEach((fila) => {
        const url = (
            fila.querySelector(".input-imagen-url") as HTMLInputElement
        ).value.trim();
        if (!url) return; // imagen vacía: se omite
        if (!url.startsWith("http") || urlsVistas.has(url)) {
            imgValida = false;
        } else {
            urlsVistas.add(url);
            imagenes.push(url);
        }
    });

    if (!imgValida) {
        view.mostrarNotificacionEstado(
            false,
            "Alguna URL de imagen es inválida o está repetida.",
        );
        return;
    }

    const nuevaReceta: UserOwnRecipe = {
        id:
            Date.now().toString(36) +
            Math.random().toString(36).substring(2),
        userId: usuario.id,
        name: nombre,
        category: categoria,
        area: area,
        instructions: instrucciones,
        ingredients: ingredientes,
        images: imagenes,
        createdAt: new Date(),
    };

    storage.saveUserOwnRecipe(nuevaReceta);
    view.mostrarNotificacionEstado(true, "¡Receta guardada correctamente!");
    cargarTablaRecetasPropias();
    resetearFormulario(sufijo);
}

function resetearFormulario(sufijo: "Blanco" | "Api"): void {
    (
        document.querySelector(`#formReceta${sufijo}`) as HTMLFormElement
    ).reset();
    (
        document.querySelector(`#listaIngredientes${sufijo}`) as HTMLDivElement
    ).innerHTML = "";
    (
        document.querySelector(`#listaImagenes${sufijo}`) as HTMLDivElement
    ).innerHTML = "";
    agregarFilaIngrediente(`listaIngredientes${sufijo}`);
    if (sufijo === "Api") {
        (
            document.querySelector("#resultadosBusqueda") as HTMLDivElement
        ).innerHTML = "";
    }
}

// ── Cargar selects de categoría y área ──────────────────────────────────────

async function cargarSelectsCategoriaArea(): Promise<void> {
    const api = new ApiService();

    try {
        const [categorias, areas] = await Promise.all([
            api.pedirTodasCategorias(),
            api.pedirTodasAreas(),
        ]);

        document
            .querySelectorAll<HTMLSelectElement>(".select-categoria")
            .forEach((select) => {
                select.innerHTML =
                    '<option value="">-- Selecciona categoría --</option>';
                categorias.forEach((cat) => {
                    select.innerHTML += `<option value="${cat.strCategory}">${cat.strCategory}</option>`;
                });
            });

        document
            .querySelectorAll<HTMLSelectElement>(".select-area")
            .forEach((select) => {
                select.innerHTML =
                    '<option value="">-- Selecciona país --</option>';
                areas.forEach((area) => {
                    select.innerHTML += `<option value="${area}">${area}</option>`;
                });
            });
    } catch {
        const view = new ViewService();
        view.mostrarNotificacionEstado(
            false,
            "Error al cargar categorías y países. Comprueba la conexión.",
        );
    }
}
