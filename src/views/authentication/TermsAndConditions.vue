<script setup lang="ts">
import Logoimg from '@/assets/images/logos/focusYourLife.png';
</script>

<template>
  <v-row class="bg-containerBg position-relative" no-gutters>
    <div class="bg-blur">
      <div class="round-1"></div>
      <div class="round-2"></div>
    </div>
    <v-col cols="12" lg="12" class="d-flex align-center">
      <v-container class="con">
        <div class="d-flex align-center justify-center" style="min-height: calc(100vh - 148px)">
          <v-row justify="center">
            <v-col cols="12" md="10" lg="10">
              <v-card elevation="0" variant="outlined" rounded="lg" class="bg-surface">
                <v-card-text class="pa-sm-10 pa-6">
                  <div class="tw:grid tw:place-content-center">
                    <div class="logo">
                      <img :src="Logoimg" alt="home" width="250" />
                    </div>
                  </div>
                  <div class="text-center mt-6 mb-10">
                    <h2 class="text-h4 font-weight-bold">Términos y Condiciones</h2>
                  </div>
                  <!-- <v-divider></v-divider> -->
                  <div class="mb-6">
                    Entrenamientos Focus Your Life<br />
                    <span class="tw:font-semibold">Última actualización:</span> Enero, 2026
                  </div>

                  <div class="">
                    <p class="tw:!ml-0">
                      Al completar el proceso de inscripción y pago, el participante declara haber leído, comprendido y aceptado los
                      presentes <span class="tw:font-semibold">Términos y Condiciones</span>, los cuales regulan la prestación de los
                      servicios de entrenamiento ofrecidos por <span class="tw:font-semibold">IMPETUS S.A.S.</span>, marca comercial
                      <span class="tw:font-semibold">Focus Your Life</span>.
                    </p>

                    <h3 class="text-h6 font-weight-bold mt-6">1. Naturaleza del servicio</h3>
                    <p>
                      Focus Your Life presta servicios de <span class="tw:font-semibold">entrenamiento vivencial grupal</span>, orientados
                      al desarrollo del potencial humano, liderazgo personal y crecimiento integral.
                    </p>
                    <p>
                      Los entrenamientos no constituyen servicios médicos, psicológicos, psiquiátricos ni terapéuticos, ni sustituyen
                      tratamientos profesionales de salud física o mental.
                    </p>

                    <h3 class="text-h6 font-weight-bold mt-6">2. Modalidad del entrenamiento</h3>
                    <p>
                      El participante adquiere el entrenamiento <span class="tw:font-semibold">FOCUS</span>, el cual forma parte de un
                      proceso progresivo que incluye, de manera opcional y voluntaria, las etapas
                      <span class="tw:font-semibold">YOUR</span> y <span class="tw:font-semibold">LIFE</span>.
                    </p>
                    <p>
                      Cada etapa es independiente en su decisión de participación y se rige por las mismas condiciones generales aquí
                      descritas.
                    </p>

                    <h3 class="text-h6 font-weight-bold mt-6">3. Responsabilidades del participante</h3>
                    <p>El participante declara y acepta que:</p>
                    <ul class="ml-5 ul-con-vineta tw:text-justify">
                      <li>Asiste de manera <span class="tw:font-semibold">voluntaria</span>, consciente y responsable.</li>
                      <li>
                        Se compromete a cumplir horarios, normas internas, dinámicas, actividades y lineamientos comunicados antes y durante
                        el entrenamiento.
                      </li>
                      <li>
                        Es responsable de su estado físico, emocional y mental para participar en actividades vivenciales de alta intensidad
                        emocional.
                      </li>
                      <li>
                        Libera a Focus Your Life de cualquier responsabilidad derivada del uso personal que haga de los contenidos,
                        reflexiones o decisiones posteriores al entrenamiento.
                      </li>
                    </ul>

                    <h3 class="text-h6 font-weight-bold mt-6">4. Pagos y facturación</h3>
                    <ul class="ml-5 ul-con-vineta tw:text-justify">
                      <li>
                        El valor del entrenamiento debe ser <span class="tw:font-semibold">pagado en su totalidad</span> previo al inicio
                        del mismo.
                      </li>
                      <li>
                        La factura será emitida <span class="tw:font-semibold">únicamente a nombre del participante</span>, con los datos
                        proporcionados en el formulario de inscripción.
                      </li>
                      <li>La factura se emite una vez validado el pago, conforme a la normativa tributaria vigente.</li>
                    </ul>

                    <h3 class="text-h6 font-weight-bold mt-6">5. Política de reembolso</h3>
                    <p class="tw:ml-5">
                      Como regla general, no existen reembolsos una vez confirmado el pago y aceptados estos Términos y Condiciones.
                    </p>
                    <p>Excepcionalmente, Focus Your Life podrá analizar una solicitud de reembolso únicamente cuando:</p>
                    <ul class="ml-5 ul-con-vineta tw:text-justify">
                      <li>Exista <span class="tw:font-semibold">caso fortuito o fuerza mayor debidamente comprobado.</span></li>
                      <li>La solicitud sea presentada <span class="tw:font-semibold">por escrito</span>, con documentación de respaldo.</li>
                    </ul>
                    <p>La empresa se reserva el derecho de decidir si aplica:</p>
                    <ul class="ml-5 ul-con-vineta tw:text-justify">
                      <li>Reembolso total,</li>
                      <li>Reembolso parcial,</li>
                      <li>Reprogramación del proceso,</li>
                      <li>O negación del reembolso.</li>
                    </ul>
                    <p>La decisión será final y no apelable.</p>

                    <h3 class="text-h6 font-weight-bold mt-6">6. Tratamiento de Datos Personales</h3>
                    <p>
                      El participante autoriza a IMPETUS S.A.S. a recopilar, almacenar y tratar sus datos personales con la finalidad
                      de gestionar su inscripción, facturación, ejecución del entrenamiento y comunicaciones relacionadas con los servicios
                      contratados.
                    </p>
                    <p>
                      El tratamiento de datos se realizará conforme a la Ley Orgánica de Protección de Datos Personales, su reglamento y la
                      política interna de protección de datos de la Compañía.
                    </p>
                    <p>
                      Los datos no serán utilizados para fines distintos a los aquí establecidos ni compartidos con terceros no autorizados,
                      salvo obligación legal.
                    </p>

                    <h3 class="text-h6 font-weight-bold mt-6">7. Uso de imagen y material audiovisual</h3>
                    <p>El participante <span class="tw:font-semibold">autoriza expresa e irrevocablemente a Focus Your Life a:</span></p>
                    <ul class="ml-5 ul-con-vineta tw:text-justify">
                      <li>Tomar fotografías, videos y grabaciones de audio durante el desarrollo de los entrenamientos.</li>
                      <li>
                        Utilizar dicho material con fines
                        <span class="tw:font-semibold">educativos, promocionales, institucionales y comerciales</span>, en medios físicos o
                        digitales, redes sociales, páginas web y material corporativo.
                      </li>
                    </ul>
                    <p>Esta autorización no genera compensación económica y se mantiene vigente de forma indefinida.</p>

                    <h3 class="text-h6 font-weight-bold mt-6">8. Confidencialidad</h3>
                    <p>El participante se compromete a mantener confidencialidad sobre:</p>
                    <ul class="ml-5 ul-con-vineta tw:text-justify">
                      <li>Contenidos internos del entrenamiento,</li>
                      <li>Metodologías,</li>
                      <li>Materiales,</li>
                      <li>Experiencias compartidas por otros participantes.</li>
                    </ul>
                    <p>La divulgación no autorizada podrá generar acciones legales conforme a la ley ecuatoriana.</p>

                    <h3 class="text-h6 font-weight-bold mt-6">9. Limitación de responsabilidad</h3>
                    <p>Focus Your Life no será responsable por:</p>
                    <ul class="ml-5 ul-con-vineta tw:text-justify">
                      <li>
                        Decisiones personales, profesionales, financieras o familiares que el participante tome antes, durante o después del
                        entrenamiento.
                      </li>
                      <li>Interpretaciones individuales de los contenidos.</li>
                      <li>Resultados específicos, ya que el proceso depende del nivel de compromiso y participación del asistente.</li>
                    </ul>

                    <h3 class="text-h6 font-weight-bold mt-6">10. Legislación aplicable y jurisdicción</h3>
                    <p>
                      Estos Términos y Condiciones se rigen por las leyes de la <span class="tw:font-semibold">República del Ecuador</span>.
                    </p>
                    <p>
                      Cualquier controversia será resuelta mediante <span class="tw:font-semibold">mediación y arbitraje</span>, conforme a
                      la normativa vigente.
                    </p>

                    <h3 class="text-h6 font-weight-bold mt-6">11. Aceptación</h3>
                    <p>
                      La inscripción, el pago y la asistencia al entrenamiento constituyen
                      <span class="tw:font-semibold">aceptación expresa</span> de estos Términos y Condiciones, los cuales tienen plena
                      validez legal.
                    </p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>
      </v-container>
    </v-col>
  </v-row>
</template>

<style scoped>
p {
  text-align: justify;
  margin-left: calc(var(--tw-spacing) * 5);
  margin-top: calc(var(--tw-spacing) * 3);
}

.ul-con-vineta {
  list-style: disc;
  padding-left: 1.25rem; /* equivalente a pl-5 */
}

.step-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
  background-color: white;
  position: relative;
  transition: all 0.3s ease;
}

.step-circle.active {
  background-color: rgb(var(--v-theme-primary));
  border-color: rgb(var(--v-theme-primary));
}

.step-circle.completed {
  background-color: rgb(var(--v-theme-success));
  border-color: rgb(var(--v-theme-success));
}

.step-line {
  width: 100px;
  height: 2px;
  background-color: #e2e8f0;
  margin: 0 -20px;
  transition: all 0.3s ease;
}

.step-line.completed {
  background-color: rgb(var(--v-theme-success));
}

.v-window {
  border-radius: 8px;
  overflow: hidden;
}

.v-window-item {
  transition: all 0.3s ease;
}

:deep(.v-window__container) {
  border-radius: 8px;
}

.v-card {
  transition: all 0.3s ease;
}

.hide-spin-buttons:deep(input[type='number']) {
  -moz-appearance: textfield;
  appearance: textfield;
}

.hide-spin-buttons:deep(input::-webkit-outer-spin-button),
.hide-spin-buttons:deep(input::-webkit-inner-spin-button) {
  -webkit-appearance: none;
  margin: 0;
}
</style>
