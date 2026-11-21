"""Excepciones de dominio. La capa HTTP las traduce a códigos de respuesta."""


class ErrorDominio(Exception):
    """Base para reglas de negocio incumplidas."""


class ReservaInvalida(ErrorDominio):
    """Datos de reserva que no cumplen las reglas (fechas, personas, etc.)."""


class ConflictoReserva(ErrorDominio):
    """La reserva choca con la capacidad del servicio o con otra del turista."""


class SinOferta(ErrorDominio):
    """No hay servicios disponibles para cubrir alguna parte del plan."""


class PresupuestoInsuficiente(ErrorDominio):
    """El presupuesto no alcanza para cubrir el plan mínimo."""

    def __init__(self, minimo: float):
        self.minimo = round(minimo, 2)
        super().__init__(
            f"El presupuesto no alcanza. Mínimo estimado: S/ {self.minimo:.2f}"
        )
