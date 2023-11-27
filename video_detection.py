import cv2
import os
import time

# chamada de detector haarcascade
face_cascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# captura o video da webcam
cap = cv2.VideoCapture(0)

# caso queira capturar de um video já gravado armazenado em disco, retirar o comentario do código abaixo
# cap = cv2.VideoCapture('filename.mp4')

# a janela de reconhecimento ficará aberta por 5 segundos, para enquadrar a face 
runtime = 5

# a foto será tirada após passar 5 segundos, essa foto tem a duração de 1 segundo
capture_wait_time = 1

# verifica se tem uma pasta criada para salvar as fotos, caso não tenha, cria uma no diretório
output_folder = 'facial-recognition-app/src/visitors'
os.makedirs(output_folder, exist_ok=True)

start_time = time.time()

while (time.time() - start_time) < runtime:
    # faz a leitura do frame
    _, img = cap.read()
    
    # converte a imagem em escala de cinza
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # trata da acurácia e precisão da detecção
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.3, minNeighbors=5)
    
    # desenha o retangulo em volta da face detectada, para tirar uma foto somente da face
    for (x, y, w, h) in faces:
        # aumenta a escala do retangulo em x2
        scale_factor = 2
        x = int(x - (w * (scale_factor - 1) / 2))
        y = int(y - (h * (scale_factor - 1) / 2))
        w = int(w * scale_factor)
        h = int(h * scale_factor)
        
        cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)

    # mostra a foto capturada
    cv2.imshow('img', img)
    
    # apertar esc para sair do programa
    k = cv2.waitKey(30) & 0xff
    if k == 27:
        break

# Salve a imagem capturada dentro da pasta "visitors"
if len(faces) > 0:
    face_image = img[y:y+h, x:x+w]
    count = 1
    while os.path.exists(f"{output_folder}/visitor{count}.jpeg"):
        count += 1
    filename = f"{output_folder}/visitor{count}.jpeg"
    cv2.imwrite(filename, face_image)
    print(f"Imagem capturada e salva como {filename}")

