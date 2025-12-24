def es_primo(n: int) -> bool:
    """
    Determina si un número es primo.
    Un número primo es mayor que 1 y solo divisible por 1 y por sí mismo.
    """
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True


def obtener_primos(lista: list[int]) -> list[int]:
    """
    Recibe una lista de números enteros y devuelve una nueva lista
    con solo los números primos de la original.
    """
    
    if not lista:
        return []
    
    primos = []
    for num in lista:
        if es_primo(num):
            primos.append(num)
    
    return primos


# Ejemplo de uso
if __name__ == "__main__":
    numeros = [10, 15, 3, 7, 11, 20, 23, 29, 30, 31, 37, 40]
    primos_encontrados = obtener_primos(numeros)
    print(f"Números originales: {numeros}")
    print(f"Números primos: {primos_encontrados}")
    # Salida esperada: [3, 7, 11, 23, 29, 31, 37]
