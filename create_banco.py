import sqlite3

# Criar banco.db e tabela de usuários
conn = sqlite3.connect('banco.db')
cursor = conn.cursor()

cursor.execute('''
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
    )
''')

conn.commit()
conn.close()

print("Arquivo banco.db criado com sucesso!")